import React, { useState } from "react";

function ForgotPasswordForm(props) {
    const [email, setEmail] = useState("");

    function handleEmailChange(e) {
        setEmail(e.target.value);
    }

    function handleSubmit() {
        console.log("Password reset requested for:", email);
    }

    return (
        <form>
            <div className="form-group">
                <label htmlFor="emailInput">Email address</label>
                <input
                    type="email"
                    onChange={handleEmailChange}
                    className="form-control"
                    id="emailInput"
                    aria-describedby="emailHelp"
                />
                <small id="emailHelp" className="form-text text-muted">
                    Enter your email to receive a password reset link.
                </small>
            </div>
            <button type="button" onClick={handleSubmit} className="btn btn-primary">
                Reset Password
            </button>
        </form>
    );
}

export default ForgotPasswordForm;
