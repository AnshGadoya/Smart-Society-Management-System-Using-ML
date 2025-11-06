from flask import Blueprint, request, jsonify
from sqlalchemy.exc import IntegrityError

from models.HousingUnitModel import BlockUtilityUsage
from utils.config import db

utility = Blueprint('utility', __name__, url_prefix='/utilities')


# -------------------------------
# GET all utilities or by block
# -------------------------------
@utility.route('/', methods=['GET'])
def get_utilities():
    block_id = request.args.get('block_id', type=int)
    try:
        if block_id:
            utilities = BlockUtilityUsage.query.filter_by(block_id=block_id).all()
        else:
            utilities = BlockUtilityUsage.query.all()

        data = [{
            'id': u.id,
            'date': u.date.isoformat(),
            'block_id': u.block_id,
            'block_name': u.block.block_name if u.block else "",
            'utility_type': u.utility_type,
            'value': u.value,
            'unit': u.unit,
            'description': u.description,
            'anomaly_score': u.anomaly_score,
            'is_anomaly': u.is_anomaly
        } for u in utilities]

        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------------------
# POST new utility record
# -------------------------------
@utility.route('/', methods=['POST'])
def add_utility():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data provided"}), 400

    try:
        new_utility = BlockUtilityUsage(
            date=data.get('date'),
            block_id=data.get('block_id'),
            utility_type=data.get('utility_type'),
            value=data.get('value'),
            unit=data.get('unit'),
            description=data.get('description'),
            anomaly_score=data.get('anomaly_score', None),
            is_anomaly=data.get('is_anomaly', False)
        )

        db.session.add(new_utility)
        db.session.commit()

        return jsonify({"status": "success", "message": "Utility added successfully"}), 201
    except IntegrityError as e:
        db.session.rollback()
        return jsonify({"error": "Duplicate entry for block, date, and utility_type"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# -------------------------------
# PUT update utility record
# -------------------------------
@utility.route('/<int:utility_id>', methods=['PUT'])
def update_utility(utility_id):
    data = request.get_json()
    try:
        utility_record = BlockUtilityUsage.query.get_or_404(utility_id)

        utility_record.date = data.get('date', utility_record.date)
        utility_record.block_id = data.get('block_id', utility_record.block_id)
        utility_record.utility_type = data.get('utility_type', utility_record.utility_type)
        utility_record.value = data.get('value', utility_record.value)
        utility_record.unit = data.get('unit', utility_record.unit)
        utility_record.description = data.get('description', utility_record.description)
        utility_record.anomaly_score = data.get('anomaly_score', utility_record.anomaly_score)
        utility_record.is_anomaly = data.get('is_anomaly', utility_record.is_anomaly)

        db.session.commit()
        return jsonify({"status": "success", "message": "Utility updated successfully"}), 200
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Duplicate entry for block, date, and utility_type"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# -------------------------------
# DELETE utility record
# -------------------------------
@utility.route('/<int:utility_id>', methods=['DELETE'])
def delete_utility(utility_id):
    try:
        utility_record = BlockUtilityUsage.query.get_or_404(utility_id)
        db.session.delete(utility_record)
        db.session.commit()
        return jsonify({"status": "success", "message": "Utility deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
