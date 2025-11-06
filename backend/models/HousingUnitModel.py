from utils.config import db


class Block(db.Model):
    __tablename__ = 'blocks'

    id = db.Column(db.Integer, primary_key=True , autoincrement=True)
    block_name = db.Column(db.String(10), nullable=False)
    flat_count = db.Column(db.Integer, nullable=False)

    # relationships
    housing_units = db.relationship("HousingUnit", back_populates="block", cascade="all, delete-orphan")
    maintenances = db.relationship("BlockMaintenance", back_populates="block", cascade="all, delete-orphan")
    payments = db.relationship("FlatPayment", back_populates="block", cascade="all, delete-orphan")
    utilities = db.relationship("BlockUtilityUsage", back_populates="block", cascade="all, delete-orphan")
    units = db.relationship("HousingUnit", back_populates="block", cascade="all, delete-orphan" , lazy=True, )

class HousingUnit(db.Model):
    __tablename__ = 'housing_units'

    id = db.Column(db.Integer, primary_key=True , autoincrement=True)
    block_id = db.Column(db.Integer, db.ForeignKey('blocks.id'), nullable=False)
    unit_number = db.Column(db.String(10), nullable=False)
    type = db.Column(db.String(20))

    # relationships
    block = db.relationship("Block", back_populates="housing_units")
    payments = db.relationship("FlatPayment", back_populates="flat", cascade="all, delete-orphan")
    members = db.relationship("HousingMember", back_populates="unit", cascade="all, delete-orphan")

class BlockMaintenance(db.Model):
    __tablename__ = 'block_maintenance'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    block_id = db.Column(db.Integer, db.ForeignKey('blocks.id'), nullable=False)
    month = db.Column(db.String(7), nullable=False)  # YYYY-MM
    total_amount = db.Column(db.Float, nullable=False)
    per_flat_amount = db.Column(db.Float, nullable=False)
    due_date = db.Column(db.String(10), nullable=False)  # YYYY-MM-DD
    collected_date = db.Column(db.String(10))
    status = db.Column(db.String(20), nullable=False, default="Open")  # Open | Delayed | Paid | Missed
    risk_label = db.Column(db.String(20))
    risk_score = db.Column(db.Float)

    # relationships
    block = db.relationship("Block", back_populates="maintenances")

    __table_args__ = (
        db.UniqueConstraint('block_id', 'month', name='uq_block_month'),
    )


class FlatPayment(db.Model):
    __tablename__ = 'flat_payments'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    block_id = db.Column(db.Integer, db.ForeignKey('blocks.id'), nullable=False)
    flat_id = db.Column(db.Integer, db.ForeignKey('housing_units.id'), nullable=False)
    month = db.Column(db.String(7), nullable=False)  # YYYY-MM
    per_flat_amount = db.Column(db.Float, nullable=False)
    paid_date = db.Column(db.String(10))  # null = pending
    status = db.Column(db.String(20), nullable=False, default="Pending")  # Pending | Paid

    # relationships
    flat = db.relationship("HousingUnit", back_populates="payments")
    block = db.relationship("Block", back_populates="payments")

    __table_args__ = (
        db.UniqueConstraint('flat_id', 'month', name='uq_flat_month'),
    )


class BlockUtilityUsage(db.Model):
    __tablename__ = 'block_utility_usage'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    date = db.Column(db.Date, nullable=False)  # e.g., 2024-01-01
    block_id = db.Column(db.Integer, db.ForeignKey('blocks.id'), nullable=False)
    utility_type = db.Column(db.String(50), nullable=False)  # water, electricity, gas, maintenance_charges, etc.
    value = db.Column(db.Float, nullable=False)  # usage amount
    unit = db.Column(db.String(50), nullable=False)  # KL, kWh, INR, etc.
    description = db.Column(db.String(255))  # optional extra info
    anomaly_score = db.Column(db.Float)  # ML anomaly detection score (0..1)
    is_anomaly = db.Column(db.Boolean, default=False)

    # relationships
    block = db.relationship("Block", back_populates="utilities")

    __table_args__ = (
        db.UniqueConstraint('block_id', 'date', 'utility_type', name='uq_block_date_utility'),
    )


# Block ↔ HousingUnit (1-to-many)
# Block ↔ BlockMaintenance (1-to-many)
# Block ↔ FlatPayment (1-to-many)
# HousingUnit ↔ FlatPayment (1-to-many)
# Block ↔ BlockUtilityUsage (1-to-many)