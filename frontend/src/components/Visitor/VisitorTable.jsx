import React, { useState, useEffect } from "react";
import { visitorsApi } from "../../services/api";

function VisitorTable() {
    const [visitors, setVisitors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVisitors();
    }, []);

    const fetchVisitors = async () => {
        try {
            const response = await visitorsApi.getVisitors();
            console.log(response);
            setVisitors(response || []);
        } catch (error) {
            console.error("Error fetching visitors:", error);
            alert("Failed to load visitors");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container mt-4">
                <div className="d-flex justify-content-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="card shadow-sm">
                <div className="card-header bg-info text-white">
                    <h5 className="mb-0">Pre-registered Visitors</h5>
                </div>
                <div className="card-body">
                    {visitors.length === 0 ? (
                        <p className="text-center text-muted">No visitors pre-registered yet.</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-striped table-hover">
                                <thead className="table-dark">
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Visit Date</th>
                                    <th>Purpose</th>
                                    <th>FlatNo.</th>
                                    <th>Access Code</th>
                                </tr>
                                </thead>
                                <tbody>
                                {visitors.map((visitor, index) => (
                                    <tr key={index}>
                                        <td>{visitor.name}</td>
                                        <td>{visitor.email}</td>
                                        <td>{visitor.phone || "N/A"}</td>
                                        <td>{new Date(visitor.visitDate).toLocaleDateString()}</td>
                                        <td>{visitor.purpose || "N/A"}</td>
                                        <td>{visitor.flatNo}</td>
                                        <td>
                                                <span className="badge bg-success fs-6">
                                                    {visitor.code}
                                                </span>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default VisitorTable;