from utils.config import db


class Staff(db.Model):
    __tablename__ = "staff"

    staff_id = db.Column(db.String(50), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=True)
    phone = db.Column(db.String(20), nullable=True)
    department = db.Column(db.String(100), nullable=True)
    position = db.Column(db.String(100), nullable=True)
    hire_date = db.Column(db.Date, nullable=True)
    address = db.Column(db.Text, nullable=True)
    emergency_contact = db.Column(db.String(100), nullable=True)
    emergency_phone = db.Column(db.String(20), nullable=True)
    status = db.Column(db.String(20), default="active")
    photo = db.Column(db.String(200), nullable=True)  # store file path or URL
    qualifications = db.Column(db.Text, nullable=True)

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
