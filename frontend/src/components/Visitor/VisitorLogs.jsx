import React from "react";

function VisitorLogs({visitors, columns}) {

    return (
        <div className="container mt-5">
            <h3 className="mb-4 text-center">Visitor Logs</h3>

            <div className="card shadow-sm">
                <div className="card-body">
                    {visitors.length === 0 ? (
                        <p className="text-center">No visitors found.</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-striped">
                                <thead>
                                <tr>
                                    {columns.map((col, idx) => (
                                        <th key={idx}>{col}</th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {visitors.map((v, idx) => (
                                    <tr key={idx}>
                                        <td>{v.name}</td>
                                        <td>{v.email}</td>
                                        <td>{v.phone || "N/A"}</td>
                                        <td>{v.visitDate}</td>
                                        <td>{v.purpose || "N/A"}</td>
                                        <td>{v.code}</td>
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

export default VisitorLogs;
