// App.js or LandingPage.js
import React from "react";
import {useNavigate} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import AdminComplaints from "./ComplaintView";
import PATHS from "../../utils/constants/Path";

export default function Service() {
    const navigate = useNavigate();

    return (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
            <h1 className="mb-5">Welcome to Smart Society Dashboard</h1>

            <div className="d-flex flex-column gap-3">
                <button
                    className="btn btn-primary btn-lg shadow-lg"
                    onClick={() => navigate(PATHS.VIEWCOMPLAINT)}
                >
                    Manage Complaints
                </button>

                <button
                    className="btn btn-success btn-lg shadow-lg"
                    onClick={() => alert("Feature coming soon!")}
                >
                    Attendance
                </button>

                <button
                    className="btn btn-warning btn-lg shadow-lg"
                    onClick={() => navigate(PATHS.COMPLAINTCHART)}
                >
                    Complaints Chart
                </button>
            </div>
        </div>
    );
}
