import React from "react";


function IncomeBy() {
    return (
        <>
            <div className="card shadow-sm flex-fill w-100">
                <div className="card-header d-flex align-items-center justify-content-between">
                    <h5 className="fw-bold mb-0">Income By </h5>
                    <div className="dropdown">
                        <a href="/" onClick={(e) => {
                            e.preventDefault()
                        }}
                           className="btn btn-sm px-2 border shadow-sm btn-outline-white d-inline-flex align-items-center"
                           data-bs-toggle="dropdown">
                            Weekly <i className="ti ti-chevron-down ms-1"></i>
                        </a>
                        <ul className="dropdown-menu">
                            <li>
                                <a className="dropdown-item" href="/">Monthly</a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="/">Weekly</a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="/">Yearly</a>
                            </li>
                        </ul>
                    </div>
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
        </>
    )
}

export default IncomeBy;