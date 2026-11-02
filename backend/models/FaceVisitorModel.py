from utils.config import db
from datetime import datetime

class FaceVisitor(db.Model):
    __tablename__ = "face_visitors"
    _primary_key = "id"

    def to_dict(self):
        return {
            "id": self.id,
            "visitor_id": self.visitor_id,
            "name": self.name,
            "work_type": self.work_type,
            "backup_code": self.backup_code,
            "registered_at": str(self.registered_at) if self.registered_at else None,
            "last_seen": str(self.last_seen) if self.last_seen else None
        }
