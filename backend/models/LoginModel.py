from utils.config import db
from datetime import datetime, timezone

class Login(db.Model):
    __tablename__ = "login"
    _primary_key = "id"

    @property
    def member(self):
        from models.HousingMemberModel import HousingMember
        return HousingMember.query.filter_by(member_id=self.member_id).first()
