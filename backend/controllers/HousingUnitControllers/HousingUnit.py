from flask import Blueprint, request, jsonify

from models.HousingUnitModel import HousingUnit

from utils.config import db

housing = Blueprint('housing', __name__, url_prefix='/housing')


# GET all housing units
@housing.route('/', methods=['GET'])
def get_housing_units():
    housing_units = HousingUnit.query.all()
    housing_data = []
    for unit in housing_units:
        housing_data.append({
            'id': unit.id,
            'block_id': unit.block_id,
            'block_name': unit.block.block_name if unit.block else None,
            'unit_number': unit.unit_number,
            'type': unit.type
        })
    return jsonify(housing_data)


# POST - add multiple housing units
@housing.route('/', methods=['POST'])
def add_housing_units():
    try:
        data = request.get_json()
        if not isinstance(data, list):
            return jsonify({"error": "Expected a list of housing units"}), 400

        new_units = []
        for unit in data:
            block_id = unit.get("block_id")  # use block_id from frontend
            unit_number = unit.get("unit_number")
            unit_type = unit.get("type")

            if not block_id or not unit_number:
                return jsonify({"error": "block_id and unit_number are required"}), 400

            new_unit = HousingUnit(
                block_id=block_id,
                unit_number=unit_number,
                type=unit_type
            )
            new_units.append(new_unit)

        db.session.add_all(new_units)
        db.session.commit()
        return jsonify({"status": "success", "message": "Housing units added successfully"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# PUT - update a housing unit
@housing.route('/<int:unit_id>', methods=['PUT'])
def edit_housing_unit(unit_id):
    try:
        unit = HousingUnit.query.get_or_404(unit_id)
        data = request.get_json()
        print(data)

        unit.block_id = data.get("block_id", unit.block_id)
        unit.unit_number = data.get("unit_number", unit.unit_number)
        unit.type = data.get("type", unit.type)

        db.session.commit()
        return jsonify({"status": "success", "message": "Housing unit updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# DELETE - delete a housing unit
@housing.route('/<int:unit_id>', methods=['DELETE'])
def delete_housing_unit(unit_id):
    try:
        unit = HousingUnit.query.get_or_404(unit_id)
        db.session.delete(unit)
        db.session.commit()
        return jsonify({"status": "success", "message": "Housing unit deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
