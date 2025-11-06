import React from "react";

function Top5Owners() {
    return (<>
        <div className="card shadow-sm flex-fill w-100">
            <div className="card-header d-flex align-items-center justify-content-between">
                <h5 className="fw-bold mb-0">Top 5 Owners</h5>
            </div>
            <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <div>
                        <p className="fw-semibold mb-1 text-dark">Cardiology</p>
                        <p className="mb-0">4,556 Apointments</p>
                    </div>
                    <h6 className="fw-bold mb-0">$5,985</h6>
                </div>
            </div>
        </div>
    </>)
}

export default Top5Owners;