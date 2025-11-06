from flask import Blueprint, request, jsonify
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import re


complaint = Blueprint('complaint', __name__)


#
# @complaint.route('/', methods=['POST'] , endpoint='addComplaint')
# def addComplaint():
#     data = request.get_json()
#     print(data)
#     return jsonify({"status": "success", "message": "Housing units added successfully"}) ,201


# -------------------------------
# 1️⃣ Training Data
# -------------------------------
training_data = [
    # Utility
    ("Garbage not collected from my flat", "Utility"),
    ("Water supply is not coming since morning", "Utility"),
    ("Drainage issue in basement area", "Utility"),
    ("Dustbin overflow near building", "Utility"),
    ("Street lights not working properly", "Utility"),
    ("Cleanliness issue near garden area", "Utility"),
    ("Garbage dumped in parking area", "Utility"),
    ("Dustbin not cleaned regularly", "Utility"),

    # Maintenance
    ("Lift not working since yesterday", "Maintenance"),
    ("Tap leakage in bathroom", "Maintenance"),
    ("Plumbing repair needed", "Maintenance"),
    ("AC needs repairing in clubhouse", "Maintenance"),
    ("Fan is broken and needs maintenance", "Maintenance"),
    ("Light not working in corridor", "Maintenance"),
    ("Door lock needs repair", "Maintenance"),
    ("Wall paint peeling off", "Maintenance"),

    # Security
    ("Unauthorized person entered building", "Security"),
    ("Security guard not available at gate", "Security"),
    ("CCTV camera not recording", "Security"),
    ("Theft happened in parking area", "Security"),
    ("Suspicious activity near main gate", "Security"),
    ("Gate left open without guard", "Security"),
    ("Stranger loitering near society entrance", "Security"),
]

# -------------------------------
# 2️⃣ Train ML Model
# -------------------------------
texts = [t[0] for t in training_data]
labels = [t[1] for t in training_data]

vectorizer = TfidfVectorizer(stop_words="english")
X = vectorizer.fit_transform(texts)
model = LogisticRegression()
model.fit(X, labels)

# -------------------------------
# 3️⃣ Text Cleaning Helper
# -------------------------------
def clean_text(text):
    """Remove unwanted characters and lowercase the text."""
    text = re.sub(r"[^a-zA-Z\s]", "", text.lower())
    return text.strip()

# -------------------------------
# 4️⃣ API Endpoint for Complaint Classification
# -------------------------------
@complaint.route('/', methods=['POST'])
def addComplaint():
    try:
        data = request.get_json()
        title = data.get("title", "")
        description = data.get("description", "")
        resident_name = data.get("resident_name", "")
        flat_no = data.get("flat_no", "")
        attachment_url = data.get("attachment_url", "")

        # Combine title and description for better context
        combined_text = clean_text(title + " " + description)

        # Predict category using trained model
        X_input = vectorizer.transform([combined_text])
        predicted_category = model.predict(X_input)[0]
        confidence = model.predict_proba(X_input).max()

        # You can later save this complaint in the database here 👇
        # new_complaint = ComplaintModel(
        #     title=title,
        #     description=description,
        #     resident_name=resident_name,
        #     flat_no=flat_no,
        #     attachment_url=attachment_url,
        #     category=predicted_category,
        #     confidence=confidence
        # )
        # db.session.add(new_complaint)
        # db.session.commit()

        return jsonify({
            "status": "Complaint submitted successfully",
            "category": predicted_category,
            "confidence": float(confidence)
        }), 201

    except Exception as e:
        print("Error in addComplaint:", e)
        return jsonify({"error": str(e)}), 500