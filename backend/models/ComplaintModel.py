from utils.config import db


class Complaint(db.Model):
    __tablename__ = "complaint"

    id = db.Column(db.Integer, primary_key=True)
    complaint_id = db.Column(db.String(50), unique=True)
    title = db.Column(db.String(255))
    description = db.Column(db.Text)
    resident_name = db.Column(db.String(100))
    flat_no = db.Column(db.String(20))
    attachment_url = db.Column(db.String(255))
    category = db.Column(db.String(50))
    confidence = db.Column(db.Float)
    status = db.Column(db.String(50), default="Pending")
    created_at = db.Column(db.DateTime)

    assigned_staff_id = db.Column(db.String(50), db.ForeignKey("staff.staff_id"), nullable=True)
    assigned_staff = db.relationship("Staff", backref="complaints")


    def to_dict(self):
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
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S") if self.created_at else None
        }