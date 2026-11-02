from utils.config import db

class HousingMember(db.Model):
    __tablename__ = "housing_members"
    _primary_key = "id"

    @property
    def unit(self):
        from models.HousingUnitModel import HousingUnit
        return HousingUnit.query.get(self.unit_id)

    @property
    def login(self):
        from models.LoginModel import Login
        return Login.query.filter_by(member_id=self.member_id).first()
