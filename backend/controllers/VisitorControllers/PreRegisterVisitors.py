import random
from datetime import datetime

from flask_mail import Message, Mail

from flask import Blueprint, jsonify, current_app, request

from models.VisitorModel import Visitor
from utils.config import db

from models.HousingMemberModel import HousingMember
from models.HousingUnitModel import HousingUnit

visitor = Blueprint('visitor', __name__)

mail = Mail()


def generate_code():
    return str(random.randint(100000, 999999))


@visitor.route('/visitors', methods=['GET'])
def get_visitors():
    visitors = Visitor.query.filter_by().all()
    print(visitors)

    # housing_data = [{
    #     'id': unit.id,
    #     'block_number': unit.block_number,
    #     'unit_number': unit.unit_number,
    #     'type': unit.type
    #     # Add all other relevant fields
    # } for unit in housing]
    # print(housing_data)

    return jsonify([visitor.to_dict() for visitor in visitors])


def send_welcome_email(visitor):
    try:
        msg = Message(

            subject='Your Visitor Access Code',
            sender=current_app.config['MAIL_USERNAME'],
            recipients=[visitor.email]
        )

        msg.body = f"""
        Dear {visitor.name},
        
        Thank you for pre-registering as a visitor!
        
        Your visitor details:
        - Name: {visitor.name}
        - Visit Date: {visitor.visit_date}
        - Purpose: {visitor.purpose or 'Not specified'}
        
        Your unique access code is: {visitor.code}
        
        Please present this code upon arrival for verification.
        
        Best regards,
        Visitor Management System
        """

        mail.send(msg)
        print(f"Email sent to {visitor.email}")

    except Exception as e:
        print(f"Failed to send email: {str(e)}")


@visitor.route('/visitors', methods=['POST'])
def add_visitor():
    try:
        data = request.get_json()

        # Generate unique code
        code = generate_code()
        while Visitor.query.filter_by(code=code).first():
            code = generate_code()

        # Create new visitor
        visitor = Visitor(
            name=data['name'],
            email=data['email'],
            phone=data.get('phone', ''),
            visit_date=data['visitDate'],
            purpose=data.get('purpose', ''),
            flat_no=data['flatNo'],
            code=code
        )

        print("Adding visitor:", visitor.to_dict())
        db.session.add(visitor)
        db.session.commit()

        # Send welcome email
        send_welcome_email(visitor)

        # return jsonify(visitor.to_dict()), 201
        return jsonify({"status": "success", "message": "Visitor added successfully"}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 400

@visitor.route('/verify', methods=['POST'])
def verify_visitor():
    try:
        data = request.get_json()
        code = data.get('code')

        if not code:
            return jsonify({"error": "Code is required"}), 400

        visitor = Visitor.query.filter_by(code=str(code)).first()

        if not visitor:
            return jsonify({"valid": False, "message": "Invalid code"}), 404

        return jsonify({
            "valid": True,
            "visitor": visitor.to_dict()
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


import random
from datetime import datetime
from flask import request, jsonify
from models.HousingMemberModel import HousingMember
from models.HousingUnitModel import HousingUnit
from models.VisitorModel import Visitor
from utils.config import db

@visitor.route("/request", methods=["POST"])
def create_visitor_request():
    data = request.get_json()

    # ✅ Validate required fields
    required_fields = ["name", "flatNo"]
    for field in required_fields:
        if not data.get(field):
            return jsonify({"error": f"{field} is required"}), 400

    flat_no = data.get("flatNo")

    # ✅ Split the flat number into block and unit parts
    try:
        block_no, unit_no = flat_no.split("-")
    except ValueError:
        return jsonify({"error": "Invalid flat format. Use format like '1-501'"}), 400

    # ✅ Find member for this flat
    member = (
        HousingMember.query
        .join(HousingUnit)
        .filter(
            HousingUnit.block_id == str(block_no),
            HousingUnit.unit_number == str(unit_no)
        )
        .first()
    )

    if not member:
        return jsonify({"error": "Flat not found"}), 404

    # ✅ Generate a random code
    code = str(random.randint(100000, 999999))

    # ✅ Create new visitor request
    visitor = Visitor(
        name=data["name"],
        phone=data.get("phone"),
        email=data.get("email"),
        purpose=data.get("purpose"),
        flat_no=flat_no,
        member_id=member.member_id,
        visit_date=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        status="pending",
        code=code
    )

    db.session.add(visitor)
    db.session.commit()

    return jsonify({
        "message": "Visitor request created successfully",
        "visitor": visitor.to_dict()
    }), 201


@visitor.route("/pending/<string:member_id>", methods=["GET"])
def get_pending_visitors(member_id):
    visitors = Visitor.query.filter_by(member_id=member_id, status="pending").all()
    return jsonify([v.to_dict() for v in visitors])


@visitor.route("/approve/<int:visitor_id>", methods=["PUT"])
def approve_visitor(visitor_id):
    visitor = Visitor.query.get_or_404(visitor_id)
    visitor.status = "approved"
    visitor.code = str(random.randint(100000, 999999))
    db.session.commit()
    return jsonify({"status":"success","message": "Visitor approved", "code": visitor.code})

@visitor.route("/decline/<int:visitor_id>", methods=["PUT"])
def decline_visitor(visitor_id):
    visitor = Visitor.query.get_or_404(visitor_id)
    visitor.status = "declined"
    db.session.commit()
    return jsonify({"message": "Visitor declined"})


@visitor.route("/status/<int:visitor_id>", methods=["GET"])
def get_visitor_status(visitor_id):
    visitor = Visitor.query.get(visitor_id)
    if not visitor:
        return jsonify({"error": "Visitor not found"}), 404

    return jsonify({
        "id": visitor.id,
        "status": visitor.status,
        "flat_no": visitor.flat_no,
        "name": visitor.name,
        "purpose": visitor.purpose
    }), 200





