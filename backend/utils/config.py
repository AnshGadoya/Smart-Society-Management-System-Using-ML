import os
from utils.mongo_db import MongoDB

# Initialize MongoDB client & ORM layer
db = MongoDB()

def init_app(app):
    """Initialize the Flask app with MongoDB Atlas."""
    app.config['MONGO_URI'] = os.getenv("MONGO_URI") or os.getenv("MONGODB_URI")
    db.init_app(app)
