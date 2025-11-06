from datetime import datetime

from utils.config import db


class Visitor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20))
    visit_date = db.Column(db.String(20), nullable=False)
    purpose = db.Column(db.String(200))
    code = db.Column(db.String(6), nullable=False, unique=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'visitDate': self.visit_date,
            'purpose': self.purpose,
            'code': self.code
        }
