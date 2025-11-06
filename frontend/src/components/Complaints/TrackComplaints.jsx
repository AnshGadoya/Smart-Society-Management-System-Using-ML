import React, { useState } from "react";

function TrackComplaints() {
    const [complaints, setComplaints] = useState([
        { id: 1, title: "Water leakage in bathroom", category: "Maintenance", date: "2025-08-20", status: "Pending" },
        { id: 2, title: "Power outage in Block A", category: "Utilities", date: "2025-08-21", status: "In Progress" },
        { id: 3, title: "Unauthorized parking", category: "Security", date: "2025-08-22", status: "Resolved" },
        { id: 4, title: "Loud music at night", category: "Noise", date: "2025-08-23", status: "Closed" },
    ]);

    const [filterStatus, setFilterStatus] = useState("All");

    const filteredComplaints = filterStatus === "All"
        ? complaints
        : complaints.filter(c => c.status === filterStatus);

    return (
        <div className="container mt-5">
            <h3 className="mb-4 text-center">Track Complaints</h3>

            {/* Filter by Status */}
            <div className="mb-4 row">
                <div className="col-md-3">
                    <select
                        className="form-select"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="All">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                    </select>
                </div>
            </div>

            {/* Complaints Table */}
            <div className="card shadow-sm p-3">
                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredComplaints.length > 0 ? (
                            filteredComplaints.map((c) => (
                                <tr key={c.id}>
                                    <td>{c.id}</td>
                                    <td>{c.title}</td>
                                    <td>{c.category}</td>
                                    <td>{c.date}</td>
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
