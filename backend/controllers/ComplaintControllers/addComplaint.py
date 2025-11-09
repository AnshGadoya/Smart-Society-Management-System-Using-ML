import random
from datetime import datetime

from flask import Blueprint, request, jsonify
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import re

from models.ComplaintModel import Complaint
from utils.config import db

from models.StaffModel import Staff

complaint = Blueprint('complaint', __name__)


#
# @complaint.route('/', methods=['POST'] , endpoint='addComplaint')
# def addComplaint():
#     data = request.get_json()
#     print(data)
#     return jsonify({"status": "success", "message": "Housing units added successfully"}) ,201


# -------------------------------
# 1️⃣ Training Data
# -------------------------------
training_data = [
    # Utility
    ("Garbage not collected from my flat", "Utility"),
    ("Water supply is not coming since morning", "Utility"),
    ("Drainage issue in basement area", "Utility"),
    ("Dustbin overflow near building", "Utility"),
    ("Street lights not working properly", "Utility"),
    ("Cleanliness issue near garden area", "Utility"),
    ("Garbage dumped in parking area", "Utility"),
    ("Dustbin not cleaned regularly", "Utility"),


    # Maintenance
    ("Lift not working since yesterday", "Maintenance"),
    ("Tap leakage in bathroom", "Maintenance"),
    ("Plumbing repair needed", "Maintenance"),
    ("AC needs repairing in clubhouse", "Maintenance"),
    ("Fan is broken and needs maintenance", "Maintenance"),
    ("Light not working in corridor", "Maintenance"),
    ("Door lock needs repair", "Maintenance"),
    ("Wall paint peeling off", "Maintenance"),
    ("Gas Leakage","Maintenance"),
    ("Water Leakage / Split","Maintenance"),

    # Security
    ("Unauthorized person entered building", "Security"),
    ("Security guard not available at gate", "Security"),
    ("CCTV camera not recording", "Security"),
    ("Theft happened in parking area", "Security"),
    ("Suspicious activity near main gate", "Security"),
    ("Gate left open without guard", "Security"),
    ("Stranger loitering near society entrance", "Security"),
]

# -------------------------------
# 2️⃣ Train ML Model
# -------------------------------
texts = [t[0] for t in training_data]
labels = [t[1] for t in training_data]

vectorizer = TfidfVectorizer(stop_words="english")
X = vectorizer.fit_transform(texts)
model = LogisticRegression()
model.fit(X, labels)

# -------------------------------
# 3️⃣ Text Cleaning Helper
# -------------------------------
def clean_text(text):
    """Remove unwanted characters and lowercase the text."""
    text = re.sub(r"[^a-zA-Z\s]", "", text.lower())
    return text.strip()



@complaint.route('/staff/<string:staff_id>', methods=['GET'])
def get_complaints_by_staff(staff_id):
    try:
        # 🔹 Fetch staff details
        staff_member = Staff.query.filter_by(staff_id=staff_id).first()
        if not staff_member:
            return jsonify({"error": "Staff member not found"}), 404

        # 🔹 Read and normalize department
        staff_department = (staff_member.department or "").lower().strip()

        # 🔹 Map departments to complaint categories
        department_category_map = {
            "security": "Security",
            "maintenance": "Maintenance",
            "utility": "Utility",
            "housekeeping": "Utility",       # same type of tasks
            "management": "Maintenance",     # can also handle general issues
            "administration": "Utility",     # notices, cleaning, etc.
        }

        staff_category = department_category_map.get(staff_department, None)

        if not staff_category:
            return jsonify({
                "error": f"No complaint category mapped for department '{staff_member.department}'"
            }), 400

        # 🔹 Fetch complaints related to this category
        complaints = Complaint.query.filter_by(category=staff_category).all()

        return jsonify([
            {
                "complaint_id": c.complaint_id,
                "title": c.title,
                "description": c.description,
                "category": c.category,
                "status": c.status,
                "created_at": c.created_at.strftime("%Y-%m-%d %H:%M:%S") if c.created_at else None
            } for c in complaints
        ]), 200

    except Exception as e:
        print("Error in get_complaints_by_staff:", e)
        return jsonify({"error": str(e)}), 500



# ---------------------------------------------
# 3️⃣ GET all complaints
# ---------------------------------------------
@complaint.route("/", methods=["GET"])
def get_complaints():
    try:
        complaints = Complaint.query.all()
        return jsonify([
            {
                "id": c.id,
                "complaint_id": c.complaint_id,
                "title": c.title,
                "description": c.description,
                "resident_name": c.resident_name,
                "flat_no": c.flat_no,
                "attachment_url": c.attachment_url,
                "category": c.category,
                "confidence": c.confidence,
                "status": c.status,
                "created_at": c.created_at.strftime("%Y-%m-%d %H:%M:%S") if c.created_at else None
            } for c in complaints
        ]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -------------------------------
# 4️⃣ API Endpoint for Complaint Classification
# -------------------------------
@complaint.route('/', methods=['POST'])
def addComplaint():
    try:
        data = request.get_json()
        title = data.get("title", "")
        description = data.get("description", "")
        resident_name = data.get("resident_name", "")
        flat_no = data.get("flat_no", "")
        attachment_url = data.get("attachment_url", "")

        # Combine title and description for better context
        combined_text = clean_text(title + " " + description)

        # Predict category using trained model
        X_input = vectorizer.transform([combined_text])
        predicted_category = model.predict(X_input)[0]
        confidence = model.predict_proba(X_input).max()

        assigned_staff = Staff.query.filter(
            (Staff.department.ilike(predicted_category)) |
            (Staff.position.ilike(predicted_category))
        ).first()

        assigned_staff_id = assigned_staff.staff_id if assigned_staff else None

        new_complaint = Complaint(
            complaint_id=data.get("complaint_id", f"COMP-{random.randint(1000, 99999)}"),
            title=title,
            description=description,
            resident_name=resident_name,
            flat_no=flat_no,
            attachment_url=attachment_url,
            category=predicted_category,
            confidence=confidence,
            status="Pending",
            created_at=datetime.now(),
            assigned_staff_id=assigned_staff_id
        )

        db.session.add(new_complaint)
        db.session.commit()

        return jsonify({
            "status": "Complaint submitted successfully",
            "category": predicted_category,
            "confidence": float(confidence),
            "assigned_staff": assigned_staff.name if assigned_staff else "Not Assigned"
        }), 201




    except Exception as e:
        print("Error in addComplaint:", e)
        return jsonify({"error": str(e)}), 500


@complaint.route('/<string:id>/status', methods=['PUT'])
def update_complaint_status(id):
    data = request.get_json()
    new_status = data.get("status")

    # Example logic:
    complaint = Complaint.query.filter_by(complaint_id=id).first()
    if not complaint:
        return jsonify({"error": "Complaint not found"}), 404

    complaint.status = new_status
    db.session.commit()

    return jsonify({"message": "Status updated", "complaint_id": id, "status": new_status}), 200






