from utils.config import db

class Staff(db.Model):
    __tablename__ = "staff"
    _primary_key = "staff_id"

    def to_dict(self):
        return {
            "staff_id": self.staff_id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "department": self.department,
            "position": self.position,
            "hire_date": str(self.hire_date) if self.hire_date else None,
            "address": self.address,
            "emergency_contact": self.emergency_contact,
            "emergency_phone": self.emergency_phone,
            "status": self.status,
            "photo": self.photo,
            "qualifications": self.qualifications,
        }
