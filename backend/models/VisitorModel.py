from utils.config import db
from datetime import datetime

class Visitor(db.Model):
    __tablename__ = "visitor"
    _primary_key = "id"

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'visitDate': self.visit_date or getattr(self, "visitDate", ""),
            'purpose': self.purpose,
            'flatNo': self.flat_no or getattr(self, "flatNo", ""),
            'member_id': self.member_id,
            'code': self.code,
            'status': self.status
        }
