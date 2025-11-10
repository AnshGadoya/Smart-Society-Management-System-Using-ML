from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from flask_migrate import Migrate

from controllers.LoginController.adminLogin import seed_admin
from controllers.LoginController.Login import login
from controllers.HousingUnitControllers.HousingUnit import housing
from controllers.BlockControllers.blocks import blocks
from controllers.HousingUnitControllers.HousingMember import member
from controllers.MaintenanceControllers.maintenanceControllers import utility
from controllers.NoticeController.NoticeController import notices
from controllers.StaffController.StaffController import staff
from controllers.VisitorControllers.PreRegisterVisitors import visitor
from controllers.ComplaintControllers.addComplaint import complaint
from controllers.FaceRecognitionController.face_recognition import face_recog
from utils.config import init_app, db
from flask import Flask, request, jsonify
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import re


app = Flask(__name__)
CORS(app)

load_dotenv()
init_app(app)

migrate = Migrate(app, db)


with app.app_context():
    # db.drop_all()
    db.create_all()
    seed_admin()

app.register_blueprint(blocks, url_prefix="/blocks")
app.register_blueprint(housing, url_prefix='/housing')

app.register_blueprint(complaint, url_prefix='/complaint')
app.register_blueprint(visitor, url_prefix='/visitor')
app.register_blueprint(utility, url_prefix='/utility')
app.register_blueprint(member , url_prefix='/member')
app.register_blueprint(staff , url_prefix='/staff')
app.register_blueprint(notices, url_prefix='/notices')

app.register_blueprint(face_recog, url_prefix='/face')

app.register_blueprint(login, url_prefix='/login')



@app.route('/')
def hello_world():
    return 'Hello World!'


if __name__ == '__main__':
    app.run()

