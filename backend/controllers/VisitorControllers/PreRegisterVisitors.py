import random
from flask_mail import Message, Mail

from flask import Blueprint, jsonify, current_app, request

from models.VisitorModel import Visitor
from utils.config import db

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
            code=code
        )

        db.session.add(visitor)
        db.session.commit()

        # Send welcome email
        send_welcome_email(visitor)

        # return jsonify(visitor.to_dict()), 201
        return jsonify({"status": "success", "message": "Visitor added successfully"}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 400


