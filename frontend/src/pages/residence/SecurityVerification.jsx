import React, { useState } from "react";
import { visitorsApi } from "../../services/api";

function SecurityVerification() {
    const [code, setCode] = useState("");
    const [visitor, setVisitor] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [verificationStatus, setVerificationStatus] = useState("");

    const handleVerify = async (e) => {
        e.preventDefault();
        if (!code.trim()) {
            setError("Please enter a verification code");
            return;
        }

        setLoading(true);
        setError("");
        setVisitor(null);
        setVerificationStatus("");

        try {
            const response = await visitorsApi.verifyVisitor(code);
            if (response.data) {
                setVisitor(response.data);
                setVerificationStatus("verified");
                setCode("");
            }
        } catch (error) {
            setError(error.response?.data?.message || "Invalid verification code");
            setVerificationStatus("invalid");
        } finally {
            setLoading(false);
        }
    };

    const clearResults = () => {
        setVisitor(null);
        setError("");
        setVerificationStatus("");
        setCode("");
    };

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow">
                        <div className="card-header bg-dark text-white">
                            <h4 className="mb-0">Visitor Verification System</h4>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleVerify}>
                                <div className="mb-3">
                                    <label htmlFor="verificationCode" className="form-label">
                                        Enter Visitor Verification Code
                                    </label>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control form-control-lg"
                                            id="verificationCode"
                                            placeholder="Enter 6-digit code"
                                            value={code}
                                            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                            disabled={loading}
                                        />
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={loading || code.length !== 6}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                    Verifying...
                                                </>
                                            ) : (
                                                "Verify Code"
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </form>

                            {/* Verification Status Indicators */}
                            {verificationStatus === "verified" && (
                                <div className="alert alert-success mt-3" role="alert">
                                    <i className="bi bi-check-circle-fill me-2"></i>
                                    Visitor verified successfully!
                                </div>
                            )}

                            {verificationStatus === "invalid" && (
                                <div className="alert alert-danger mt-3" role="alert">
                                    <i className="bi bi-x-circle-fill me-2"></i>
                                    {error || "Invalid verification code"}
                                </div>
                            )}

                            {/* Visitor Details Card */}
                            {visitor && (
                                <div className="mt-4">
                                    <div className="card">
                                        <div className="card-header bg-success text-white">
                                            <h5 className="mb-0">Visitor Details</h5>
                                        </div>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <p><strong>Name:</strong> {visitor.name}</p>
                                                    <p><strong>Email:</strong> {visitor.email}</p>
                                                    <p><strong>Phone:</strong> {visitor.phone || "N/A"}</p>
                                                </div>
                                                <div className="col-md-6">
                                                    <p><strong>Visit Date:</strong> {new Date(visitor.visitDate).toLocaleDateString()}</p>
                                                    <p><strong>Purpose:</strong> {visitor.purpose || "N/A"}</p>
                                                    <p>
                                                        <strong>Status:</strong>
                                                        <span className="badge bg-success ms-2">Verified</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="mt-3 text-center">
                                                <span className="display-6 text-primary fw-bold">{visitor.code}</span>
                                                <p className="text-muted">Verification Code</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-3">
                                        <button
                                            className="btn btn-outline-secondary"
                                            onClick={clearResults}
                                        >
                                            <i className="bi bi-arrow-repeat me-2"></i>
                                            Verify Another Visitor
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Instructions Panel */}
                    <div className="card mt-4">
                        <div className="card-header bg-light">
                            <h6 className="mb-0">Security Instructions</h6>
                        </div>
                        <div className="card-body">
                            <ol className="mb-0">
                                <li>Ask the visitor for their 6-digit verification code</li>
                                <li>Enter the code in the field above and click "Verify Code"</li>
                                <li>If verified, check the visitor's details and photo ID for confirmation</li>
                                <li>Provide directions or escort as needed</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SecurityVerification;