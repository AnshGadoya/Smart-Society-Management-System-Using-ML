from flask import Blueprint, request, jsonify
import numpy as np
import base64
import cv2
import os


face_recog = Blueprint("face_recog", __name__)

# Directory to save registered faces
SAVE_DIR = "registered_faces"
os.makedirs(SAVE_DIR, exist_ok=True)

# Load pre-trained OpenCV Haar Cascade for face detection
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")


def decode_base64_image(base64_str):
    try:
        img_data = base64.b64decode(base64_str.split(',')[1])
        np_arr = np.frombuffer(img_data, np.uint8)
        return cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    except Exception as e:
        print("Decode error:", e)
        return None


@face_recog.route('/register', methods=['POST'])
def register_face():
    data = request.get_json()
    username = data.get('name')
    image_data = data.get('image')

    if not username or not image_data:
        return jsonify({"message": "Name and image required"}), 400

    img = decode_base64_image(image_data)
    if img is None:
        return jsonify({"message": "Invalid image data"}), 400

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.2, minNeighbors=5)

    if len(faces) == 0:
        return jsonify({"message": "No face detected"}), 400

    for (x, y, w, h) in faces:
        face_crop = gray[y:y+h, x:x+w]
        face_path = os.path.join(SAVE_DIR, f"{username}.jpg")
        cv2.imwrite(face_path, face_crop)
        return jsonify({"message": f"Face registered for {username}"}), 200

    return jsonify({"message": "Registration failed"}), 500


@face_recog.route('/attendance', methods=['POST'])
def mark_attendance():
    data = request.get_json()
    image_data = data.get('image')

    if not image_data:
        return jsonify({"message": "Image required"}), 400

    img = decode_base64_image(image_data)
    if img is None:
        return jsonify({"message": "Invalid image data"}), 400

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.2, minNeighbors=5)

    if len(faces) == 0:
        return jsonify({"message": "No face detected"}), 400

    for (x, y, w, h) in faces:
        face_crop = gray[y:y+h, x:x+w]

        best_match = None
        lowest_diff = float('inf')

        # Compare captured face with registered ones
        for file in os.listdir(SAVE_DIR):
            if file.endswith(".jpg"):
                registered_img = cv2.imread(os.path.join(SAVE_DIR, file), cv2.IMREAD_GRAYSCALE)
                if registered_img is None:
                    continue

                # Resize to same size
                registered_img = cv2.resize(registered_img, (face_crop.shape[1], face_crop.shape[0]))

                diff = np.mean((registered_img - face_crop) ** 2)

                if diff < lowest_diff:
                    lowest_diff = diff
                    best_match = os.path.splitext(file)[0]

        if best_match and lowest_diff < 1000:  # threshold — adjust if needed
            return jsonify({"message": f"Attendance marked for {best_match}"}), 200
        else:
            return jsonify({"message": "Face not recognized"}), 401

    return jsonify({"message": "Error processing attendance"}), 500

