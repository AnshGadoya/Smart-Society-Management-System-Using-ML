from utils.config import db
import json

class Notice(db.Model):
    __tablename__ = "notice"
    _primary_key = "id"

    def to_dict(self):
        att = self.attachments
        if isinstance(att, str):
            try:
                att_list = json.loads(att)
            except Exception:
                att_list = att.split(",") if att else []
        elif isinstance(att, list):
            att_list = att
        else:
            att_list = []

        return {
            "id": self.id,
            "notice_id": self.notice_id,
            "title": self.title,
            "body": self.body,
            "category": self.category,
            "issue_date": str(self.issue_date) if self.issue_date else None,
            "valid_until": str(self.valid_until) if self.valid_until else None,
            "issuer_name": self.issuer_name,
            "target_audience": self.target_audience,
            "attachments": att_list,
            "ack_required": self.ack_required or "no"
        }
