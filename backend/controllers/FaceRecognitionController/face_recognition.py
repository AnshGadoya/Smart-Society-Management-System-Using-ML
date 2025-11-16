# backend/controller/face_recognition.py
import os
import cv2
import json
import base64
import numpy as np
from datetime import datetime
import secrets

from flask import Blueprint, request, jsonify
from utils.config import db
from models.FaceVisitorModel import FaceVisitor

face_recog = Blueprint("face_recog", __name__)

# -----------------------
# Model files (A -> backend/ml_models/)
# -----------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", ".."))

MODEL_DIR = os.path.join(BACKEND_DIR, "ml_models")
MODEL_PROTO = os.path.join(MODEL_DIR, "deploy.prototxt")
MODEL_WEIGHTS = os.path.join(MODEL_DIR, "res10_300x300_ssd_iter_140000.caffemodel")

if not (os.path.exists(MODEL_PROTO) and os.path.exists(MODEL_WEIGHTS)):
    raise FileNotFoundError("deploy.prototxt or caffemodel missing. Place them in backend/ml_models/")

FACE_NET = cv2.dnn.readNetFromCaffe(MODEL_PROTO, MODEL_WEIGHTS)
CONFIDENCE_THRESHOLD = 0.6

# -----------------------
# Encoding cache (loaded from DB)
# -----------------------
ENCODINGS_CACHE = []  # list of dicts: {visitor_id, name, encoding(np.array), backup_code}

def refresh_encodings_cache():
    """Load all encodings from DB into ENCODINGS_CACHE (call on startup and after registration)."""
    global ENCODINGS_CACHE
    ENCODINGS_CACHE = []
    try:
        visitors = FaceVisitor.query.all()
        for v in visitors:
            try:
                enc_list = json.loads(v.face_encoding or "[]")
                enc_arr = np.array(enc_list, dtype=np.float32)
                ENCODINGS_CACHE.append({
                    "visitor_id": v.visitor_id,
                    "name": v.name,
                    "encoding": enc_arr,
                    "backup_code": v.backup_code
                })
            except Exception as e:
                # skip malformed encoding
                print(f"[face_recog] skip encoding for {v.visitor_id}: {e}")
    except Exception as e:
        print("[face_recog] failed to load encodings from DB:", e)

# initial load
refresh_encodings_cache()

# -----------------------
# Helpers
# -----------------------
def decode_base64_image(base64_str):
    try:
        if "," in base64_str:
            base64_str = base64_str.split(",")[1]
        img_data = base64.b64decode(base64_str)
        np_arr = np.frombuffer(img_data, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        return img
    except Exception as e:
        print("[face_recog] decode error:", e)
        return None

def detect_faces_dnn(frame, conf_threshold=CONFIDENCE_THRESHOLD):
    h, w = frame.shape[:2]
    blob = cv2.dnn.blobFromImage(cv2.resize(frame, (300, 300)), 1.0,
                                 (300, 300), (104.0, 177.0, 123.0))
    FACE_NET.setInput(blob)
    detections = FACE_NET.forward()
    boxes = []
    for i in range(detections.shape[2]):
        confidence = float(detections[0, 0, i, 2])
        if confidence > conf_threshold:
            box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
            (x1, y1, x2, y2) = box.astype("int")
            x1, y1 = max(0, x1), max(0, y1)
            x2, y2 = min(w - 1, x2), min(h - 1, y2)
            boxes.append((x1, y1, x2 - x1, y2 - y1, confidence))
    return boxes

def compute_deepface_encoding(face_crop):
    # grayscale -> resize 100x100 -> flatten -> normalize -> list
    gray = cv2.cvtColor(face_crop, cv2.COLOR_BGR2GRAY)\
    if face_crop.ndim == 3 else face_crop
    resized = cv2.resize(gray, (100, 100))
    arr = resized.flatten().astype("float32")
    arr = arr / 255.0
    return arr.tolist()

def l2_distance(a, b):
    return np.linalg.norm(a - b)

# -----------------------
# ROUTES
# -----------------------

@face_recog.route("/register", methods=["POST"])
def register_visitor():
    """
    JSON: { "name": "...", "work_type": "...", "image": "data:image/...;base64,...." }
    Returns: visitor_id + backup_code
    """
    data = request.get_json(force=True)
    name = data.get("name")
    work_type = data.get("work_type", "")
    image_b64 = data.get("image")

    if not name or not image_b64:
        return jsonify({"success": False, "message": "name and image required"}), 400

    img = decode_base64_image(image_b64)
    if img is None:
        return jsonify({"success": False, "message": "invalid image data"}), 400

    faces = detect_faces_dnn(img)
    if len(faces) == 0:
        return jsonify({"success": False, "message": "no face detected"}), 400

    # choose largest face
    faces_sorted = sorted(faces, key=lambda x: x[2]*x[3], reverse=True)
    x, y, w, h, conf = faces_sorted[0]
    face_crop = img[y:y+h, x:x+w]

    encoding = compute_encoding_from_face(face_crop)
    encoding_json = json.dumps(encoding)

    visitor_id = "VIS" + secrets.token_hex(4).upper()
    backup_code = str(secrets.randbelow(900000) + 100000)  # 6-digit

    now = datetime.utcnow()

    # create SQLAlchemy model and commit
    try:
        fv = FaceVisitor(
            visitor_id=visitor_id,
            name=name,
            work_type=work_type,
            face_encoding=encoding_json,
            backup_code=backup_code,
            registered_at=now
        )
        db.session.add(fv)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print("[face_recog] DB insert error:", e)
        return jsonify({"success": False, "message": f"DB insert error: {e}"}), 500

    # refresh in-memory cache so recognition sees the new visitor immediately
    refresh_encodings_cache()

    return jsonify({
        "success": True,
        "visitor_id": visitor_id,
        "name": name,
        "backup_code": backup_code,
        "message": "Visitor registered. Give this code to the visitor and ask them to remember it."
    }), 201

@face_recog.route("/recognize", methods=["POST"])
def recognize_visitor():
    """
    JSON: { "image": "data:image/...;base64,..." }
    Returns: matched visitor info and updates last_seen (only)
    """
    data = request.get_json(force=True)
    image_b64 = data.get("image")
    if not image_b64:
        return jsonify({"success": False, "message": "image required"}), 400

    img = decode_base64_image(image_b64)
    if img is None:
        return jsonify({"success": False, "message": "invalid image data"}), 400

    faces = detect_faces_dnn(img)
    if len(faces) == 0:
        return jsonify({"success": False, "message": "no face detected"}), 400

    faces_sorted = sorted(faces, key=lambda x: x[2]*x[3], reverse=True)
    x, y, w, h, conf = faces_sorted[0]
    face_crop = img[y:y+h, x:x+w]

    encoding = np.array(compute_encoding_from_face(face_crop), dtype=np.float32)

    # find best match from cache
    best_match = None
    best_dist = float("inf")

    print("best_dist initial:", best_dist)
    for v in ENCODINGS_CACHE:
        try:
            dist = l2_distance(v["encoding"], encoding)
            if dist < best_dist:
                best_dist = dist
                best_match = v
        except Exception:
            continue

    THRESHOLD =3500  # ~250 for length 10000

    if best_match and best_dist < THRESHOLD:
        try:
            fv = FaceVisitor.query.filter_by(visitor_id=best_match["visitor_id"]).first()
            if fv:
                fv.last_seen = datetime.utcnow()
                db.session.commit()
            return jsonify({
                "success": True,
                "visitor_id": best_match["visitor_id"],
                "name": best_match["name"],
                "distance": float(best_dist),
                "message": "Visitor recognized, entry allowed."
            }), 200
        except Exception as e:
            db.session.rollback()
            print("[face_recog] DB update error:", e)
            return jsonify({"success": False, "message": f"DB update error: {e}"}), 500

    return jsonify({"success": False, "message": "Face not recognized. Ask for backup code."}), 401

@face_recog.route("/verify_code", methods=["POST"])
def verify_backup_code():
    """
    JSON: { "backup_code": "123456" }
    Updates last_seen if code valid.
    """
    data = request.get_json(force=True)
    code = data.get("backup_code")
    if not code:
        return jsonify({"success": False, "message": "backup_code required"}), 400

    try:
        fv = FaceVisitor.query.filter_by(backup_code=code).first()
        if not fv:
            return jsonify({"success": False, "message": "Invalid backup code"}), 401

        fv.last_seen = datetime.utcnow()
        db.session.commit()

        # optionally refresh cache last_seen (not necessary for encoding)
        return jsonify({
            "success": True,
            "visitor_id": fv.visitor_id,
            "name": fv.name,
            "message": "Backup code verified. Entry allowed."
        }), 200
    except Exception as e:
        db.session.rollback()
        print("[face_recog] verify_code error:", e)
        return jsonify({"success": False, "message": str(e)}), 500

@face_recog.route("/list", methods=["GET"])
def list_visitors():
    try:
        visitors = FaceVisitor.query.order_by(FaceVisitor.name).all()
        data = []
        for v in visitors:
            data.append({
                "visitor_id": v.visitor_id,
                "name": v.name,
                "work_type": v.work_type,
                "registered_at": v.registered_at.isoformat() if v.registered_at else None,
                "last_seen": v.last_seen.isoformat() if v.last_seen else None
            })
        return jsonify({"success": True, "count": len(data), "data": data}), 200
    except Exception as e:
        print("[face_recog] list error:", e)
        return jsonify({"success": False, "message": str(e)}), 500

@face_recog.route("/refresh_cache", methods=["POST"])
def refresh_cache_route():
    """Admin/helper route to refresh encodings cache from DB."""
    try:
        refresh_encodings_cache()
        return jsonify({"success": True, "message": "Encodings cache refreshed", "count": len(ENCODINGS_CACHE)}), 200
    except Exception as e:
        print("[face_recog] refresh cache error:", e)
        return jsonify({"success": False, "message": str(e)}), 500
