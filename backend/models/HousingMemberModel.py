# models/HousingMember.py
from utils.config import db


class HousingMember(db.Model):
    __tablename__ = "housing_members"

    id = db.Column(db.Integer, primary_key=True)
    member_id = db.Column(db.String(50), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    relationship = db.Column(db.String(50), nullable=False)
    date_of_birth = db.Column(db.Date)
    aadhar_number = db.Column(db.String(12))
    is_primary = db.Column(db.Boolean, default=False)
    occupation = db.Column(db.String(100))
    move_in_date = db.Column(db.Date)
    move_out_date = db.Column(db.Date)

    status = db.Column(db.String(20), default="active")

    unit_id = db.Column(db.Integer, db.ForeignKey("housing_units.id"), nullable=False)
    unit = db.relationship("HousingUnit", back_populates="members")
    login = db.relationship("Login", back_populates="member", uselist=False)

