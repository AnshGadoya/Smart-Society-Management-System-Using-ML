from flask import Blueprint, request, jsonify

from models.StaffModel import Staff
from datetime import datetime

from utils.config import db

staff = Blueprint("staff", __name__, url_prefix="/staff")


@staff.route("/", methods=["GET"])
def get_staff():
    try:
        staff_members = Staff.query.all()
        return jsonify([s.to_dict() for s in staff_members])
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Add staff
@staff.route("/", methods=["POST"])
def add_staff():
    try:
        data = request.get_json()

        staff = Staff(
            staff_id=data.get("staff_id"),
            name=data.get("name"),
            email=data.get("email"),
            phone=data.get("phone"),
            department=data.get("department"),
            position=data.get("position"),
            hire_date=datetime.strptime(data.get("hire_date"), "%Y-%m-%d").date() if data.get("hire_date") else None,
            address=data.get("address"),
            emergency_contact=data.get("emergency_contact"),
            emergency_phone=data.get("emergency_phone"),
            status=data.get("status", "active"),
            photo=data.get("photo"),
            qualifications=data.get("qualifications"),
        )

        db.session.add(staff)
        db.session.commit()

        return jsonify({"message": "Staff member added successfully", "staff": staff.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# Update staff
@staff.route("/<staff_id>", methods=["PUT"])
def update_staff(staff_id):
    try:
        staff = Staff.query.get_or_404(staff_id)
        data = request.get_json()

        staff.name = data.get("name", staff.name)
        staff.email = data.get("email", staff.email)
        staff.phone = data.get("phone", staff.phone)
        staff.department = data.get("department", staff.department)
        staff.position = data.get("position", staff.position)
        if data.get("hire_date"):
            staff.hire_date = datetime.strptime(data.get("hire_date"), "%Y-%m-%d").date()
        staff.address = data.get("address", staff.address)
        staff.emergency_contact = data.get("emergency_contact", staff.emergency_contact)
        staff.emergency_phone = data.get("emergency_phone", staff.emergency_phone)
        staff.status = data.get("status", staff.status)
        staff.photo = data.get("photo", staff.photo)
        staff.qualifications = data.get("qualifications", staff.qualifications)

        db.session.commit()
        return jsonify({"message": "Staff member updated", "staff": staff.to_dict()})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@staff.route("/<staff_id>", methods=["DELETE"])
def delete_staff(staff_id):
    try:
        staff = Staff.query.get_or_404(staff_id)
        if not staff:
            return jsonify({"error": "Staff member not found"}), 404

        db.session.delete(staff)
        db.session.commit()
        return jsonify({"message": "Staff deleted successfully"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
