import React from "react";
import ForgotPasswordForm from "../../components/auth/ForgotPasswordFrom";


function ForgotPassword(props) {
    return (
        <div className="container vh-100 d-flex justify-content-center align-items-center">
            <div className="card shadow p-4" style={{maxWidth: "400px", width: "100%"}}>
                <h3 className="card-title text-center mb-4">Forgot Password</h3>
                <p className="text-center text-muted mb-3">
                    Enter your email to receive a password reset link.
                </p>
                <ForgotPasswordForm/>
            </div>
        </div>
    );
}

export default ForgotPassword;
