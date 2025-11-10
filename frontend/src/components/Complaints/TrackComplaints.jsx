import React, {useEffect, useState} from "react";
import {fetchComplaints} from "../../services/api";
import {useNavigate} from "react-router-dom";
import PATHS from "../../utils/constants/Path";

function TrackComplaints() {
    const [complaints, setComplaints] = useState([ ]);
    const navigate = useNavigate();

    useEffect(() => {
        const getComplaints =
            async () => {
                try {
                    const response = await fetchComplaints();
                    console.log("complaint are : ", response.data);
                    setComplaints(response.data);
                } catch (err) {
                    console.error("Fetch Staff Error:", err);
                }
            }
        getComplaints();

    }, []);

    const [filterStatus, setFilterStatus] = useState("Pending");

    const filteredComplaints = filterStatus === "All"
        ? complaints
        : complaints.filter(c => c.status === filterStatus);

    return (
        <div className="container mt-5">
            <h3 className="mb-4 text-center">Track Complaints</h3>

            {/* Filter by Status */}
            <div className="mb-4 row">
                <div className="col-12 d-flex justify-content-between align-items-center">

                    {/* Filter Dropdown on left */}
                    <div className="col-md-3 p-0">
                        <select
                            className="form-select"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="All">All Statuses</option>
                            <option value="Pending">Pending</option>
                            <option value="Resolved">Resolved</option>
                        </select>
                    </div>

                    {/* Button on right */}
                    <div >
                        <button
                            className="btn btn-dark shadow-sm "
                            onClick={() => {
                                navigate(PATHS.STAFF);
                                console.log("Staff button clicked!");
                            }}
                        >
                            Staff Management
                        </button>
                    </div>
                </div>
            </div>



            {/* Complaints Table */}
            <div className="card shadow-sm p-3">
                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th>Complaint ID</th>
                            <th>Name</th>
                            <th>Flat No.</th>
                            <th>Description</th>
                            <th>Category</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredComplaints.length > 0 ? (
                            filteredComplaints.map((c,index) => (
                                <tr key={index}>
                                    <td>{c.complaint_id}</td>
                                    <td>{c.resident_name}</td>
                                    <td>{c.flat_no}</td>
                                    <td>{c.description}</td>
                                    <td>{c.category}</td>
                                    <td>{c.created_at}</td>
                                    <td>
                                            <span
                                                className={`badge ${
                                                    c.status === "Pending"
                                                        ? "bg-warning"
                                                        : c.status === "In Progress"
                                                            ? "bg-primary"
                                                            : c.status === "Resolved"
                                                                ? "bg-success"
                                                                : "bg-secondary"
                                                }`}
                                            >
                                                {c.status}
                                            </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">
                                    No complaints found.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default TrackComplaints;
