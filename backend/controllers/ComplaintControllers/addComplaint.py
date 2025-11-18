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

# -------------------------------
# 1️⃣ Training Data
# -------------------------------
training_data = [
    # Utility
    ("Garbage not collected from society bins", "Utility"),
    ("Dustbin overflow near main gate", "Utility"),
    ("Public garden needs cleaning", "Utility"),
    ("Drainage blockage in basement area", "Utility"),
    ("Street lights not working in internal roads", "Utility"),
    ("Common water supply disrupted in society", "Utility"),
    ("Water tank needs cleaning", "Utility"),
    ("Garbage dumping happening near parking area", "Utility"),
    ("Common area washroom not cleaned", "Utility"),
    ("Sewer smell near society entrance", "Utility"),
    ("Street light flickering outside community hall", "Utility"),
    ("Road inside society needs proper sweeping", "Utility"),
    ("Garbage truck did not arrive today", "Utility"),
    ("Basement drainage overflowing", "Utility"),
    ("Drinking water station empty", "Utility"),
    ("Outdoor lights not switched on at night", "Utility"),
    ("Water pipeline leakage in garden area", "Utility"),
    ("Rainwater drainage blocked in common area", "Utility"),
    ("Dustbin area stinking badly", "Utility"),
    ("Common garden dustbin missing", "Utility"),
    ("Society road area very dusty", "Utility"),
    ("Street sweeping not done today", "Utility"),
    ("Sewage water collecting near play area", "Utility"),
    ("Common water motor not turned on", "Utility"),
    ("Water pressure low in society taps", "Utility"),
    ("Street light pole fallen inside society", "Utility"),
    ("Garbage segregation not done properly", "Utility"),
    ("Basement water accumulation", "Utility"),
    ("Roadside drainage damaged inside society", "Utility"),
    ("Fogging/sanitisation not done in society", "Utility"),

    # Maintenance
    ("Lift in Tower A not working", "Maintenance"),
    ("Lift stopping between floors in Tower B", "Maintenance"),
    ("Corridor lights not working in Tower C", "Maintenance"),
    ("Society clubhouse AC not working", "Maintenance"),
    ("Community hall fan not running", "Maintenance"),
    ("Common area wall paint peeling", "Maintenance"),
    ("Gym equipment broken", "Maintenance"),
    ("Playground slide damaged", "Maintenance"),
    ("Society gate motor not functioning", "Maintenance"),
    ("Parking area lights not working", "Maintenance"),
    ("Staircase railing loose in Block D", "Maintenance"),
    ("Swimming pool pump not working", "Maintenance"),
    ("Garden irrigation system broken", "Maintenance"),
    ("Common area switchboard damaged", "Maintenance"),
    ("Fire extinguisher missing in corridor", "Maintenance"),
    ("Notice board glass broken", "Maintenance"),
    ("Water pump making loud noise", "Maintenance"),
    ("Basement ventilation system not working", "Maintenance"),
    ("Clubhouse tiles broken", "Maintenance"),
    ("Intercom system down in multiple towers", "Maintenance"),
    ("Generator backup not working", "Maintenance"),
    ("Parking gate sensor not functioning", "Maintenance"),
    ("Solar panels not charging properly", "Maintenance"),
    ("Society main gate rusting", "Maintenance"),
    ("Staircase lights fused in Tower F", "Maintenance"),
    ("Garden benches are broken", "Maintenance"),
    ("Common area doors not closing properly", "Maintenance"),
    ("Society lobby glass cracked", "Maintenance"),
    ("Tower entrance signboard damaged", "Maintenance"),
    ("Clubhouse sound system not working", "Maintenance"),

    # Security
    ("Unauthorized person entered the society", "Security"),
    ("Security guard not available at society gate", "Security"),
    ("CCTV not recording in parking area", "Security"),
    ("Suspicious activity near society entrance", "Security"),
    ("Main gate left open without guard", "Security"),
    ("Stranger loitering near tower lobby", "Security"),
    ("Visitor entered without approval", "Security"),
    ("Delivery boy not verified by guard", "Security"),
    ("Unknown vehicle parked inside society", "Security"),
    ("Security alarm not working in tower", "Security"),
    ("Guard sleeping during night shift", "Security"),
    ("Unauthorized vendors entering society", "Security"),
    ("Fight happening near front gate", "Security"),
    ("Suspicious bag found in society garden", "Security"),
    ("Patrolling not done in basement", "Security"),
    ("CCTV blind spot near kids play area", "Security"),
    ("Main gate boom barrier not working", "Security"),
    ("Security light not working near clubhouse", "Security"),
    ("Watchman allowing visitors without confirmation", "Security"),
    ("Restricted area accessed by unknown people", "Security"),
    ("Kids entering rooftop without permission", "Security"),
    ("Strangers taking photos inside society", "Security"),
    ("No guard in tower lobby", "Security"),
    ("Parking entry camera malfunctioning", "Security"),
    ("Gate sensor not detecting vehicles", "Security"),
    ("Night security patrol delayed", "Security"),
    ("Vehicle gate stuck open", "Security"),
    ("Vendor roaming without ID card", "Security"),
    ("Unauthorized car entry during night", "Security"),
    ("Suspicious noise from basement parking", "Security"),

]

# 2️⃣ Train ML Model
texts = [t[0] for t in training_data]
labels = [t[1] for t in training_data]

vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2))
X = vectorizer.fit_transform(texts)
model = LogisticRegression(max_iter=2000, C=2.0)
model.fit(X, labels)

# 3️⃣ Text Cleaning Helper
def clean_text(text):
    """Remove unwanted characters and lowercase the text."""
    # text = re.sub(r"[^a-zA-Z\s]", "", text.lower())
    text = re.sub(r'\s+', ' ', text)
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



#  GET all complaints
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

# 4️⃣ API Endpoint for Complaint Classification
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






