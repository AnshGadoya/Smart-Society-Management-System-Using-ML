import React from "react";

function RecentTransactions({title, periodOptions, transactions}) {


    return (
        <div className="card shadow-sm flex-fill w-100">
            {/* Header */}
            <div className="card-header d-flex align-items-center justify-content-between">
                <h5 className="fw-bold mb-0">{title}</h5>
                <div className="dropdown">
                    <button
                        className="btn btn-sm px-2 border shadow-sm btn-outline-white d-inline-flex align-items-center"
                        data-bs-toggle="dropdown"
                    >
                        {periodOptions[0]} <i className="ti ti-chevron-down ms-1"></i>
                    </button>
                    <ul className="dropdown-menu">
                        {periodOptions.map((option, index) => (<li key={index}>
                            <a className="dropdown-item" href="/">
                                {option}
                            </a>
                        </li>))}
                    </ul>
                </div>
            </div>

            {/* Body */}
            <div className="card-body">
                {transactions.map((tx, index) => (<div
                    key={index}
                    className={`d-flex justify-content-between align-items-center ${index < transactions.length - 1 ? "mb-3" : ""}`}
                >
                    <div className="d-flex align-items-center">
                        <a
                            href="/"
                            onClick={(e) => {
                                e.preventDefault()
                            }}
                            className="avatar me-2 flex-shrink-0"
                        >
                            <img
                                src={tx.icon}
                                alt="img"
                                className="rounded-circle"
                                style={{width: 40, height: 40}}
                            />
                        </a>
                        <div>
                            <h6 className="fs-14 mb-1 text-truncate">
                                <a href="/" onClick={(e) => {
                                    e.preventDefault()
                                }} className="fw-semibold">
                                    {tx.title}
                                </a>
                            </h6>
                            <p className="mb-0 fs-13 text-truncate">
                                <a href="/" onClick={(e) => {
                                    e.preventDefault()
                                }} className="link-primary">
                                    {tx.invoice}
                                </a>
                            </p>
                        </div>
                    </div>
                    <span
                        className={`badge fw-medium bg-${tx.amount.startsWith("-") ? "danger" : "success"} flex-shrink-0`}
                    >
                {tx.amount}
              </span>
                </div>))}
            </div>
        </div>);
}

export default RecentTransactions;
