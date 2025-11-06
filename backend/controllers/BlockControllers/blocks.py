from flask import Blueprint, request, jsonify

from models.HousingUnitModel import Block
from utils.config import db

blocks = Blueprint("blocks", __name__)


@blocks.route("/", methods=["GET"])
def get_blocks():
    blocks = Block.query.all()
    return jsonify([
        {"id": b.id, "block_name": b.block_name, "flat_count": b.flat_count}
        for b in blocks
    ])


@blocks.route("/", methods=["POST"])
def create_block():
    data = request.json
    block = Block(
        block_name=data["block_name"],
        flat_count=data["flat_count"]
    )
    db.session.add(block)
    db.session.commit()
    return jsonify({"message": "Block created"}), 201


@blocks.route("/<int:block_id>", methods=["PUT"])
def update_block(block_id):
    try:
        data = request.get_json()
        print(data)
        block = Block.query.get(block_id)
        print(block.block_name)
        if not block:
            return jsonify({"error": "Block not found"}), 404

        # Update fields
        if "block_name" in data:
            block.block_name = data["block_name"]
        if "flat_count" in data:
            block.flat_count = data["flat_count"]
        print(block.block_name)
        db.session.commit()
        return jsonify({"message": "Block updated successfully", "block": {
            "id": block.id,
            "block_name": block.block_name,
            "flat_count": block.flat_count
        }}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@blocks.route("/<int:block_id>", methods=["DELETE"])
def delete_block(block_id):
    print(type(block_id))
    block = Block.query.get(block_id)
    if not block:
        return jsonify({"error": "Block not found"}), 404

    try:
        db.session.delete(block)
        db.session.commit()
        return jsonify({"message": f"Block {block_id} deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500