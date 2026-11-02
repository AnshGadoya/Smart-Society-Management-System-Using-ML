from utils.config import db
from datetime import datetime

class Complaint(db.Model):
    __tablename__ = "complaint"
    _primary_key = "id"

    @property
    def assigned_staff(self):
        from models.StaffModel import Staff
        if self.assigned_staff_id:
            return Staff.query.get(self.assigned_staff_id)
        return None

    def to_dict(self):
        created_val = self.created_at
        if isinstance(created_val, datetime):
            created_str = created_val.strftime("%Y-%m-%d %H:%M:%S")
        elif isinstance(created_val, str):
            created_str = created_val
        else:
            created_str = None

        return {
            "id": self.id,
            "complaint_id": self.complaint_id,
            "title": self.title,
            "description": self.description,
            "resident_name": self.resident_name,
            "flat_no": self.flat_no,
            "attachment_url": self.attachment_url,
            "category": self.category,
            "confidence": self.confidence,
            "status": self.status,
            "created_at": created_str,
            "assigned_staff_id": self.assigned_staff_id
        }