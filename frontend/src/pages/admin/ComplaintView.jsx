import React, {useEffect, useState} from "react";
import {fetchComplaints, updateStatus} from "../../services/api";

export default function ViewComplaints() {
    const [complaints, setComplaints] = useState([]);

    const loadData = async () => {
        const res = await fetchComplaints();
        console.log("res", res);
        setComplaints(res.data);
    };

    const handleStatusChange = async (id, status) => {
        await updateStatus(id, status);
        loadData();
    };

    useEffect(() => {

        loadData();
    }, []);

    const getStatusBadge = (status) => {
        switch (status) {
            case "Pending":
                return <span className="badge bg-danger">{status}</span>;
            case "In Progress":
                return <span className="badge bg-warning text-dark">{status}</span>;
            case "Resolved":
                return <span className="badge bg-success">{status}</span>;
            default:
                return <span className="badge bg-secondary">{status}</span>;
        }
    };

    return (
        <div className="container mt-5">
            <div className="card shadow rounded-3">
                <div className="card-header bg-primary text-white">
                    <h3 className="mb-0">All Complaints</h3>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Resident</th>
                                <th>Category</th>
                                <th>Confidence</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {complaints.map((c) => (
                                <tr key={c.id}>
                                    <td>{c.title}</td>
                                    <td>{c.description}</td>
                                    <td>{c.resident_name} ({c.flat_no})</td>
                                    <td className="fw-bold">{c.category}</td>
                                    <td>{(c.confidence * 100).toFixed(2)}%</td>
                                    <td>{getStatusBadge(c.status)}</td>
                                    <td>
                                        <select
                                            value={c.status}
                                            onChange={(e) => handleStatusChange(c.id, e.target.value)}
                                            className="form-select form-select-sm"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="In Progress">In-Progress</option>
                                            <option value="Resolved">Resolved</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
