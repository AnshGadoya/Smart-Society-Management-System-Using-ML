import React from "react";

function VisitorManagement() {
    return (
        <div className="container mt-5">
            <h3 className="mb-4 text-center">Visitor Management</h3>

            <div className="row g-4">

                {/* Pre-register Visitors */}
                <div className="col-md-4">
                    <div className="card shadow-sm h-100">
                        <div className="card-body d-flex flex-column">
                            <h5 className="card-title">Pre-register Visitors</h5>
                            <p className="card-text flex-grow-1">
                                Quickly pre-register visitors for smooth entry. Add visitor name, contact, and visit details.
                            </p>
                            <button className="btn btn-primary mt-auto">Pre-register</button>
                        </div>
                    </div>
                </div>

                {/* Visitor Logs */}
                <div className="col-md-4">
                    <div className="card shadow-sm h-100">
                        <div className="card-body d-flex flex-column">
                            <h5 className="card-title">Visitor Logs</h5>
                            <p className="card-text flex-grow-1">
                                View detailed visitor logs including entry/exit times, purpose of visit, and visitor details.
                            </p>
                            <button className="btn btn-primary mt-auto">View Logs</button>
                        </div>
                    </div>
                </div>

                {/* Gate Passes */}
                <div className="col-md-4">
                    <div className="card shadow-sm h-100">
                        <div className="card-body d-flex flex-column">
                            <h5 className="card-title">Gate Passes</h5>
                            <p className="card-text flex-grow-1">
                                Generate gate passes for visitors with QR codes or printable passes for secure entry.
                            </p>
                            <button className="btn btn-primary mt-auto">Generate Pass</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default VisitorManagement;
