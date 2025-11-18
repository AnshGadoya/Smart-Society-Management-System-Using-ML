# models/LoginModel.py
from utils.config import db
from datetime import datetime, timezone

class Login(db.Model):
    __tablename__ = "login"

    id = db.Column(db.Integer, primary_key=True)
    member_id = db.Column(db.String(50), db.ForeignKey("housing_members.member_id"), nullable=True, unique=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(20), default="resident")  # e.g., "resident", "admin", "staff"
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    # Relationship
    member = db.relationship("HousingMember", back_populates="login")
