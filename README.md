
# Smart-Society-Management-System-Using-ML
# 🏙️ Smart Society Management System (SSMS)

![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)
![Flask](https://img.shields.io/badge/Backend-Flask-lightgrey)
![React](https://img.shields.io/badge/Frontend-React-blue)
![Machine Learning](https://img.shields.io/badge/ML-TFIDF%20%2B%20LogisticRegression-orange)
![Database](https://img.shields.io/badge/Database-MySQL-brightgreen)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

---

## 🔍 Overview  
**Smart Society Management System (SSMS)** is a full-stack web application designed to simplify and automate daily activities in a residential society.  
It offers features like complaint management, staff tracking, visitor registration, and maintenance handling — with an intelligent ML-based complaint classifier.

This system ensures seamless communication between residents, staff, and the management committee.

---

## 🚀 Key Features  

### 🧾 Complaint Management (AI-Powered)
- Automatically classifies complaints into **Utility**, **Maintenance**, or **Security** categories.
- Uses **TF-IDF + Logistic Regression** for text classification.
- Residents can attach images or details for quick resolution.

### 👷 Staff Management
- Add, edit, and view all staff members (electricians, cleaners, security guards, etc.).
- Track their department, position, hire date, and current status (Active, On Leave, Inactive).

### 🧑‍🤝‍🧑 Member & Housing Unit Management
- Maintain structured records of all flats, members, and housing blocks.
- Easy mapping between residents and units.

### 🧰 Maintenance & Utilities
- Log and monitor utility issues like water supply, garbage collection, or light failures.
- Assign to relevant staff automatically.

### 📢 Notices & Announcements
- Admin can post important notices for residents.
- View all active or past notices in one place.

### 🧑‍💻 Visitor Pre-Registration
- Residents can pre-book visitors using a simple form.
- Security staff can scan or verify visitors at the gate using QR-based entry.

### 🧠 Machine Learning Integration
- Complaint text classification using **Scikit-learn**.
- Helps in automatic routing of issues to respective departments.

---

## 🛠️ Tech Stack  

| Layer | Technology Used |
|-------|------------------|
| **Frontend** | React.js, Bootstrap 5, Axios |
| **Backend** | Flask (Python), SQLAlchemy ORM |
| **Database** | MySQL / PostgreSQL |
| **Machine Learning** | Scikit-learn (TF-IDF Vectorizer + Logistic Regression) |
| **Others** | Flask-CORS, dotenv, REST APIs |

---

## ⚙️ Installation & Setup  

### 🧩 Backend Setup  

```bash
# 🪜 Step 1 — Navigate to the backend folder
cd backend

# ⚡ Step 2 — Install backend dependencies
pip install -r requirements.txt

# ▶️ Step 3 — Run the Flask server
python app.py

# ✅ Backend server will run at:
# http://127.0.0.1:5000
```
---

### 💻 Frontend Setup  

```bash
# 🪜 Step 1 — Navigate to the frontend folder
cd frontend

# ⚡ Step 2 — Install frontend dependencies
npm install

# ▶️ Step 3 — Start the React app
npm start

# ✅ Frontend will be available at:
# http://localhost:3000
```

Visit the app at 👉 [http://localhost:3000](http://localhost:3000)


---

### 💡 Future Enhancements  
- 🔔 Real-time notifications for complaint updates  
- 💳 Online payment module for maintenance bills  
- 🧑‍💼 Role-based access control (Admin, Staff, Resident)  
- 🎙️ Voice command integration for accessibility  
- 📊 Dashboard with analytics and visual reports
