import os
import json
import base64
import numpy as np
from datetime import datetime
import secrets

from flask import Blueprint, request, jsonify
from utils.config import db
from models.FaceVisitorModel import FaceVisitor

from deepface import DeepFace

face_recog = Blueprint("face_recog", __name__)

# ---------------------------------------------------------------------
# Global Cache
# ---------------------------------------------------------------------
ENCODINGS_CACHE = []   # {visitor_id, name, work_type, embedding(np.array), backup_code}

def refresh_cache():
    """Load embeddings from DB into RAM."""
    global ENCODINGS_CACHE
    ENCODINGS_CACHE = []

    visitors = FaceVisitor.query.all()
    for v in visitors:
        if not v.face_encoding:
            continue

        emb = np.array(json.loads(v.face_encoding), dtype=np.float32)

        ENCODINGS_CACHE.append({
            "visitor_id": v.visitor_id,
            "name": v.name,
            "work_type": v.work_type,
            "embedding": emb,
            "backup_code": v.backup_code
        })

# refresh_cache()

# ---------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------

def decode_base64_image(b64):
    try:
        if "," in b64:
            b64 = b64.split(",")[1]
        img_bytes = base64.b64decode(b64)
        np_arr = np.frombuffer(img_bytes, np.uint8)

        import cv2
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        return img
    except:
        return None


def get_deepface_embedding(img):
    try:
        import cv2
        # Convert image to RGB (DeepFace expects RGB)
        if len(img.shape) == 3 and img.shape[2] == 3:  # only if color image
            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

        result = DeepFace.represent(
            img,
            model_name="ArcFace",  # change model to ArcFace if desired
            detector_backend="opencv",
            enforce_detection=True
        )

        # DeepFace returns list of embeddings in some versions
        if isinstance(result, list):
            emb = result[0]["embedding"]
        else:
            emb = result["embedding"]

        return np.array(emb, dtype=np.float32)
    except Exception as e:
        print("[embedding error]", e)
        return None


def l2(a, b):
    return np.linalg.norm(a - b)

# ---------------------------------------------------------------------
# REGISTER VISITOR
# ---------------------------------------------------------------------
@face_recog.route("/register", methods=["POST"])
def register_visitor():
    data = request.get_json(force=True)
    name = data.get("name")
    work_type = data.get("work_type", "")
    image_b64 = data.get("image")

    if not name or not image_b64:
        return jsonify({"success": False, "message": "name & image required"}), 400

    img = decode_base64_image(image_b64)
    if img is None:
        return jsonify({"success": False, "message": "invalid base64"}), 400

    embedding = get_deepface_embedding(img)
    if embedding is None:
        return jsonify({"success": False, "message": "no face detected"}), 400

    # prepare DB
    visitor_id = "VIS" + secrets.token_hex(4).upper()
    backup_code = str(secrets.randbelow(900000) + 100000)
    encoding_json = json.dumps(embedding.tolist())

    try:
        fv = FaceVisitor(
            visitor_id=visitor_id,
            name=name,
            work_type=work_type,
            face_encoding=encoding_json,
            backup_code=backup_code,
            registered_at=datetime.utcnow()
        )
        db.session.add(fv)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "message": str(e)}), 500

    refresh_cache()

    return jsonify({
        "success": True,
        "visitor_id": visitor_id,
        "backup_code": backup_code,
        "message": "Visitor registered successfully."
    }), 201

# ---------------------------------------------------------------------
# RECOGNIZE VISITOR
# ---------------------------------------------------------------------
def cosine_similarity(a, b):
    """Compute cosine similarity between two vectors"""
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

@face_recog.route("/recognize", methods=["POST"])
def recognize_visitor():
    data = request.get_json(force=True)
    image_b64 = data.get("image")

    if not image_b64:
        return jsonify({"success": False, "message": "image required"}), 400

    # Decode base64 to image
    img = decode_base64_image(image_b64)
    if img is None:
        return jsonify({"success": False, "message": "invalid base64"}), 400

    # Get embedding
    embedding = get_deepface_embedding(img)
    if embedding is None:
        return jsonify({"success": False, "message": "no face detected"}), 400

    # Compare with all registered embeddings using cosine similarity
    best_match = None
    best_sim = -1  # higher is better

    for v in ENCODINGS_CACHE:
        sim = cosine_similarity(embedding, v["embedding"])
        if sim > best_sim:
            best_sim = sim
            best_match = v

    # ArcFace typical threshold for cosine similarity
    THRESHOLD = 0.35  # tune this between 0.3-0.5 based on your environment

    if best_match and best_sim > THRESHOLD:
        try:
            # update last seen
            fv = FaceVisitor.query.filter_by(visitor_id=best_match["visitor_id"]).first()
            fv.last_seen = datetime.utcnow()
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            print("DB update error:", e)

        return jsonify({
            "success": True,
            "visitor_id": fv.visitor_id,
            "name": fv.name,
            "work_type": fv.work_type,
            "similarity": float(best_sim),
            "message": "Visitor recognized, entry allowed."
        }), 200

    return jsonify({
        "success": False,
        "message": "Face not recognized. Ask for backup code.",
        "similarity": float(best_sim)
    }), 401
# ---------------------------------------------------------------------
# VERIFY BACKUP CODE
# ---------------------------------------------------------------------
@face_recog.route("/verify_code", methods=["POST"])
def verify_backup_code():
    data = request.get_json(force=True)
    code = data.get("backup_code")

    if not code:
        return jsonify({"success": False, "message": "backup_code required"}), 400

    fv = FaceVisitor.query.filter_by(backup_code=code).first()
    if not fv:
        return jsonify({"success": False, "message": "invalid code"}), 401

    fv.last_seen = datetime.utcnow()
    db.session.commit()

    return jsonify({
        "success": True,
        "visitor_id": fv.visitor_id,
        "name": fv.name,
        "message": "Backup code verified."
    }), 200

# ---------------------------------------------------------------------
# LIST VISITORS
# ---------------------------------------------------------------------
@face_recog.route("/list", methods=["GET"])
def list_visitors():
    visitors = FaceVisitor.query.order_by(FaceVisitor.name).all()
    output = [
        {
            "visitor_id": v.visitor_id,
            "name": v.name,
            "work_type": v.work_type,
            "registered_at": v.registered_at.isoformat() if v.registered_at else None,
            "last_seen": v.last_seen.isoformat() if v.last_seen else None,
        }
        for v in visitors
    ]
    return jsonify({"success": True, "data": output}), 200

@face_recog.route("/refresh_cache", methods=["POST"])
def refresh_cache_route():
    refresh_cache()
    return jsonify({"success": True, "count": len(ENCODINGS_CACHE)}), 200
