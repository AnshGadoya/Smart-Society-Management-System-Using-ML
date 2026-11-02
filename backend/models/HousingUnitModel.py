from utils.config import db

class Block(db.Model):
    __tablename__ = 'blocks'
    _primary_key = 'id'

    @property
    def housing_units(self):
        return HousingUnit.query.filter_by(block_id=self.id).all()

    @property
    def units(self):
        return self.housing_units

    @property
    def maintenances(self):
        return BlockMaintenance.query.filter_by(block_id=self.id).all()

    @property
    def payments(self):
        return FlatPayment.query.filter_by(block_id=self.id).all()

    @property
    def utilities(self):
        return BlockUtilityUsage.query.filter_by(block_id=self.id).all()


class HousingUnit(db.Model):
    __tablename__ = 'housing_units'
    _primary_key = 'id'

    @property
    def block(self):
        return Block.query.get(self.block_id)

    @property
    def payments(self):
        return FlatPayment.query.filter_by(flat_id=self.id).all()

    @property
    def members(self):
        from models.HousingMemberModel import HousingMember
        return HousingMember.query.filter_by(unit_id=self.id).all()


class BlockMaintenance(db.Model):
    __tablename__ = 'block_maintenance'
    _primary_key = 'id'

    @property
    def block(self):
        return Block.query.get(self.block_id)


class FlatPayment(db.Model):
    __tablename__ = 'flat_payments'
    _primary_key = 'id'

    @property
    def flat(self):
        return HousingUnit.query.get(self.flat_id)

    @property
    def block(self):
        return Block.query.get(self.block_id)


class BlockUtilityUsage(db.Model):
    __tablename__ = 'block_utility_usage'
    _primary_key = 'id'

    @property
    def block(self):
        return Block.query.get(self.block_id)