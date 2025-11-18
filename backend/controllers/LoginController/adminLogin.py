# utils/seed_admin.py
from models.LoginModel import Login
from utils.config import db

def seed_admin():
    """Ensure at least one admin user exists."""
    try:
        admin = Login.query.filter_by(role="admin").first()
        if not admin:
            default_admin = Login(
                email="admin@system.com",
                password="admin123",  # You can hash this later
                role="admin"
            )
            db.session.add(default_admin)
            db.session.commit()
            print("✅ Default admin created: admin@system.com / admin123")
        else:
            print("ℹ️ Admin already exists.")
    except Exception as e:
        db.session.rollback()
        print(f"⚠️ Error creating default admin: {e}")
