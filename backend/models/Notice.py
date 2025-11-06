from utils.config import db


class Notice(db.Model):
    __tablename__ = "notice"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    notice_id = db.Column(db.String(50), primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    body = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    issue_date = db.Column(db.Date, nullable=False)
    valid_until = db.Column(db.Date, nullable=False)
    issuer_name = db.Column(db.String(100), nullable=False)
    target_audience = db.Column(db.String(100), nullable=False)
    attachments = db.Column(db.Text)  # Comma-separated files
    ack_required = db.Column(db.String(10), default="no")

    def to_dict(self):
        return {
            "notice_id": self.notice_id,
            "title": self.title,
            "body": self.body,
            "category": self.category,
            "issue_date": str(self.issue_date),
            "valid_until": str(self.valid_until),
            "issuer_name": self.issuer_name,
            "target_audience": self.target_audience,
            "attachments": self.attachments.split(",") if self.attachments else [],
            "ack_required": self.ack_required
        }
