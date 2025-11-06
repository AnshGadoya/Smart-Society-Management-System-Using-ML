# Get flat payments by block and month
from flask import jsonify
from flask.sansio.blueprints import Blueprint

from models.HousingUnitModel import FlatPayment

payments = Blueprint('payments', __name__)

@payments.route('/block/<int:block_id>/<month>', methods=['GET'])
def get_payments(block_id, month):
    payments = FlatPayment.query.filter_by(block_id=block_id, month=month).all()
    return jsonify([{
        "id": p.id,
        "block_id": p.block_id,
        "flat_id": p.flat_id,
        "month": p.month,
        "per_flat_amount": p.per_flat_amount,
        "paid_date": p.paid_date,
        "status": p.status
    } for p in payments])

# Update payment status
@payments.route('/<int:id>', methods=['PATCH'])
def update_payment(id):
    data = request.get_json()
    payment = FlatPayment.query.get(id)
    payment.status = data.get("status", payment.status)
    payment.paid_date = data.get("paid_date", payment.paid_date)
    db.session.commit()
    return jsonify({"status": "success"})
