# routes/login.py
from flask import Blueprint, request, jsonify
from models.LoginModel import Login
from models.HousingMemberModel import HousingMember
from utils.config import db
from datetime import datetime, timezone

login = Blueprint("login", __name__)

# POST - Create login
@login.route("/", methods=["POST"])
def create_login():
    try:
        data = request.json
        member_id = data.get("member_id")

        # Validate member exists
        member = HousingMember.query.filter_by(member_id=member_id).first()
        if not member:
            return jsonify({"error": "Member not found"}), 404

        # Check if login already exists
        existing = Login.query.filter_by(member_id=member_id).first()
        if existing:
            return jsonify({"error": "Login already exists for this member"}), 400

        new_login = Login(
            member_id=member_id,
            email=data.get("email"),
            password=data.get("password"),  # You can hash this later
            role=data.get("role", "resident"),
            created_at=datetime.now(timezone.utc)
        )

        db.session.add(new_login)
        db.session.commit()

        return jsonify({
            "message": "Login created successfully",
            "login": {
                "id": new_login.id,
                "member_id": new_login.member_id,
                "email": new_login.email,
                "role": new_login.role,
                "created_at": new_login.created_at
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@login.route("/verify", methods=["POST"])
def verify_login():
    try:
        data = request.json
        member_id = data.get("member_id")
        email = data.get("email")
        password = data.get("password")
        role = data.get("role")

        # if not member_id or not password:
        #     return jsonify({"error": "Member ID and password are required"}), 400

        if role == "admin":
            admin = Login.query.filter_by(role="admin", email=email, password=password).first()
            if not admin:
                return jsonify({"error": "Invalid admin credentials"}), 401
            return jsonify({"message": "Admin login successful", "role": "admin"}), 200

        if role == "guard":
            guard = Login.query.filter_by(role="guard", email=email, password=password).first()
            if not guard:
                return jsonify({"error": "Invalid guard credentials"}), 401
            return jsonify({"message": "guard login successful", "role": "guard"}), 200

        # Find login entry
        login_user = Login.query.filter_by(member_id=member_id).first()
        if not login_user:
            return jsonify({"error": "Invalid Member ID"}), 404

        # Check password
        if login_user.password != password:
            return jsonify({"error": "Invalid password"}), 401

        # Optional: check role match
        if role and login_user.role != role:
            return jsonify({"error": "Role mismatch"}), 403

        return jsonify({
            "message": "Login successful",
            "member_id": login_user.member_id,
            "role": login_user.role,
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# GET - Fetch all logins
@login.route("/", methods=["GET"])
def get_logins():
    logins = Login.query.all()
    result = [
        {
            "id": l.id,
            "member_id": l.member_id,
            "email": l.email,
            "role": l.role,
            "created_at": l.created_at
        }
        for l in logins
    ]
    return jsonify(result), 200


# DELETE - Delete login by member_id
@login.route("/<string:member_id>", methods=["DELETE"])
def delete_login(member_id):
    login = Login.query.filter_by(member_id=member_id).first()
    if not login:
        return jsonify({"error": "Login not found"}), 404

    db.session.delete(login)
    db.session.commit()
    return jsonify({"message": "Login deleted successfully"}), 200
