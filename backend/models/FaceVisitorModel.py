# models/FaceVisitorModel.py
import pytz
from utils.config import db
from datetime import datetime


class FaceVisitor(db.Model):
    __tablename__ = "face_visitors"

    id = db.Column(db.Integer, primary_key=True)
    visitor_id = db.Column(db.String(50), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    work_type = db.Column(db.String(100), nullable=True)
    face_encoding = db.Column(db.Text, nullable=False)
    backup_code = db.Column(db.String(10), nullable=False)
    registered_at = db.Column(db.DateTime, default=lambda: datetime.now(pytz.timezone("Asia/Kolkata")))
    last_seen = db.Column(db.DateTime, nullable=True)

    def to_dict(self):
        return {
            "visitor_id": self.visitor_id,
            "name": self.name,
            "work_type": self.work_type,
            "backup_code": self.backup_code,
            "registered_at": self.registered_at,
            "last_seen": self.last_seen
        }
