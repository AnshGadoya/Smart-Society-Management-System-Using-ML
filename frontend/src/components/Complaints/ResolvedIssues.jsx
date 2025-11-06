import React, { useState } from "react";

function ResolvedIssues() {
    const [issues, setIssues] = useState([
        { id: 1, title: "Power outage in Block A", category: "Utilities", reportedBy: "Vivaan Patel", resolvedDate: "2025-08-22", resolvedBy: "Admin1" },
        { id: 2, title: "Unauthorized parking", category: "Security", reportedBy: "Aditya Reddy", resolvedDate: "2025-08-23", resolvedBy: "Admin2" },
        { id: 3, title: "Water leakage in bathroom", category: "Maintenance", reportedBy: "Arjun Gupta", resolvedDate: "2025-08-24", resolvedBy: "Admin1" },
    ]);

    const [filterCategory, setFilterCategory] = useState("All");

    const filteredIssues = filterCategory === "All"
        ? issues
        : issues.filter(issue => issue.category === filterCategory);

    return (
        <div className="container mt-5">
            <h3 className="mb-4 text-center">Resolved Issues History</h3>

            {/* Filter by Category */}
            <div className="mb-4 row">
                <div className="col-md-3">
                    <select
                        className="form-select"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                    >
                        <option value="All">All Categories</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Security">Security</option>
                        <option value="Noise">Noise</option>
                    </select>
                </div>
            </div>

            {/* Resolved Issues Table */}
            <div className="card shadow-sm p-3">
                <div className="table-responsive">
                    <table className="table table-striped">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Category</th>
                            <th>Reported By</th>
                            <th>Resolved Date</th>
                            <th>Resolved By</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredIssues.length > 0 ? (
                            filteredIssues.map(issue => (
                                <tr key={issue.id}>
                                    <td>{issue.id}</td>
                                    <td>{issue.title}</td>
                                    <td>{issue.category}</td>
                                    <td>{issue.reportedBy}</td>
                                    <td>{issue.resolvedDate}</td>
                                    <td>{issue.resolvedBy}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">No resolved issues found.</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ResolvedIssues;
