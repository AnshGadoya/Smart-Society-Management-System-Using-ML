from flask import Blueprint, request, jsonify
from models.Notice import Notice
from utils.config import db
from datetime import datetime
import time

notices = Blueprint("notices", __name__)


# ---------------- GET all notices ----------------
@notices.route("/", methods=["GET"])
def get_notices():
    all_notices = Notice.query.all()
    print(list(all_notices)
          )
    return jsonify([
        {
            "id": n.id,
            "notice_id": n.notice_id,
            "title": n.title,
            "body": n.body,
            "category": n.category,
            "issue_date": n.issue_date.strftime("%Y-%m-%d") if n.issue_date else None,
            "valid_until": n.valid_until.strftime("%Y-%m-%d") if n.valid_until else None,
            "issuer_name": n.issuer_name,
            "target_audience": n.target_audience,
            "attachments": n.attachments,
            "ack_required": n.ack_required
        } for n in all_notices
    ]), 200


# ---------------- CREATE notice ----------------
import json

@notices.route("/", methods=["POST"])
def create_notice():
    try:
        data = request.json

        # Convert attachments to string if it's a list
        attachments_value = data.get("attachments")
        if isinstance(attachments_value, list):
            attachments_value = json.dumps(attachments_value)  # store as JSON string

        new_notice = Notice(
            notice_id=data.get("notice_id", f"NOTICE-{int(time.time() * 1000)}"),
            title=data.get("title"),
            body=data.get("body"),
            category=data.get("category"),
            issue_date=datetime.strptime(data["issue_date"], "%Y-%m-%d") if data.get("issue_date") else None,
            valid_until=datetime.strptime(data["valid_until"], "%Y-%m-%d") if data.get("valid_until") else None,
            issuer_name=data.get("issuer_name"),
            target_audience=data.get("target_audience"),
            attachments=attachments_value,
            ack_required=data.get("ack_required", "no"),
        )
        db.session.add(new_notice)
        db.session.commit()

        return jsonify({
            "message": "Notice created successfully",
            "notice": {
                "id": new_notice.id,
                "notice_id": new_notice.notice_id,
                "title": new_notice.title,
                "body": new_notice.body,
                "category": new_notice.category,
                "issue_date": new_notice.issue_date.strftime("%Y-%m-%d") if new_notice.issue_date else None,
                "valid_until": new_notice.valid_until.strftime("%Y-%m-%d") if new_notice.valid_until else None,
                "issuer_name": new_notice.issuer_name,
                "target_audience": new_notice.target_audience,
                "attachments": new_notice.attachments,
                "ack_required": new_notice.ack_required
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# ---------------- UPDATE notice ----------------
@notices.route("/<int:id>", methods=["PUT"])
def update_notice(id):
    try:
        data = request.json
        notice = Notice.query.get(id)

        if not notice:
            return jsonify({"error": "Notice not found"}), 404

        if "notice_id" in data:
            notice.notice_id = data["notice_id"]
        if "title" in data:
            notice.title = data["title"]
        if "body" in data:
            notice.body = data["body"]
        if "category" in data:
            notice.category = data["category"]
        if "issue_date" in data:
            notice.issue_date = datetime.strptime(data["issue_date"], "%Y-%m-%d")
        if "valid_until" in data:
            notice.valid_until = datetime.strptime(data["valid_until"], "%Y-%m-%d")
        if "issuer_name" in data:
            notice.issuer_name = data["issuer_name"]
        if "target_audience" in data:
            notice.target_audience = data["target_audience"]
        if "attachments" in data:
            notice.attachments = data["attachments"]
        if "ack_required" in data:
            notice.ack_required = data["ack_required"]

        db.session.commit()
        return jsonify({
            "message": "Notice updated successfully",
            "notice": {
                "id": notice.id,
                "notice_id": notice.notice_id,
                "title": notice.title,
                "body": notice.body,
                "category": notice.category,
                "issue_date": notice.issue_date.strftime("%Y-%m-%d") if notice.issue_date else None,
                "valid_until": notice.valid_until.strftime("%Y-%m-%d") if notice.valid_until else None,
                "issuer_name": notice.issuer_name,
                "target_audience": notice.target_audience,
                "attachments": notice.attachments,
                "ack_required": notice.ack_required
            }
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# ---------------- DELETE notice ----------------
@notices.route("/<int:id>", methods=["DELETE"])
def delete_notice(id):
    notice = Notice.query.get(id)
    if not notice:
        return jsonify({"error": "Notice not found"}), 404

    try:
        db.session.delete(notice)
        db.session.commit()
        return jsonify({"message": f"Notice {id} deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
