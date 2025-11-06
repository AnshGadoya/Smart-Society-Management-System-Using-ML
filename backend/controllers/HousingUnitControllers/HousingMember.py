from flask import Flask, request, jsonify, Blueprint

from models.HousingMemberModel import HousingMember
from utils.config import db

member = Blueprint('HousingMember', __name__)

# GET all housing members
@member.route("/", methods=["GET"])
def get_members():
    members = HousingMember.query.all()
    result = []

    for m in members:
        result.append({
            "member_id": m.member_id,
            "name": m.name,
            "email": m.email,
            "phone": m.phone,
            "relationship": m.relationship,
            "date_of_birth": str(m.date_of_birth) if m.date_of_birth else None,
            "aadhar_number": m.aadhar_number,
            "is_primary": m.is_primary,
            "occupation": m.occupation,
            "move_in_date": str(m.move_in_date) if m.move_in_date else None,
            "move_out_date": str(m.move_out_date) if m.move_out_date else None,
            "status": m.status,
            "unit_number": m.unit.unit_number,
            "block_name": m.unit.block.block_name if m.unit else None  # ✅ FIX
        })

    return jsonify(result)


# POST add a new member
@member.route("/", methods=["POST"])
def add_member():
    data = request.json
    print(data)

    # {'member_id': 'MEM-1757242469061-974', 'name': 'shubham', 'email': 'shubham@gmail.com', 'phone': '7041138931',
    #  'relationship': 'Owner', 'date_of_birth': '2025-09-02', 'aadhar_number': '254369085746', 'is_primary': False,
    #  'occupation': 'bussienss', 'move_in_date': '', 'move_out_date': '', 'status': 'active', 'block_id': '1',
    #  'unit_id': '1'}

    move_in_date = data.get("move_in_date") or None
    move_out_date = data.get("move_out_date") or None

    new_member = HousingMember(
        member_id=data.get("member_id"),
        name=data["name"],
        email=data.get("email"),
        phone=data.get("phone"),
        relationship=data.get("relationship"),
        date_of_birth=data.get("date_of_birth"),
        aadhar_number=data.get("aadhar_number"),
        is_primary=data.get("is_primary", False),
        occupation=data.get("occupation"),
        move_in_date=move_in_date,
        move_out_date=move_out_date,
        status=data.get("status", "active"),
        unit_id=data.get("unit_id")
    )

    db.session.add(new_member)
    db.session.commit()
    return jsonify({"message": "Member added successfully"}), 201

# PUT update member
@member.route("/<int:member_id>", methods=["PUT"])
def update_member(member_id):
    data = request.json
    member = HousingMember.query.filter_by(id=member_id).first_or_404()
    for key, value in data.items():
        setattr(member, key, value)
    db.session.commit()
    return jsonify({"message": "Member updated successfully"})

# DELETE member
@member.route("/<int:member_id>", methods=["DELETE"])
def delete_member(member_id):
    member = HousingMember.query.filter_by(id=member_id).first_or_404()
    db.session.delete(member)
    db.session.commit()
    return jsonify({"message": "Member deleted successfully"})
