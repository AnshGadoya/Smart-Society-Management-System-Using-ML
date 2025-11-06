import React, {useState} from "react";

function LoginFrom({onSelectRole}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [selectedRole, setSelectedRole] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    function handleEmail(e) {
        setEmail(e.target.value);
    }

    function handlePassword(e) {
        setPassword(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (!selectedRole) {
            alert("Please select a role before submitting");
            return;
        }
        console.log("Email:", email);
        console.log("Password:", password);
        console.log("Role:", selectedRole);
        // Here you would typically handle the login logic
    }

    function handleRoleSelection(role) {
        setSelectedRole(role);
        onSelectRole(role);
    }

    function togglePasswordVisibility() {
        setShowPassword(!showPassword);
    }

    return (
        <div className="container-fluid bg-light min-vh-100 d-flex align-items-center py-4">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <div className="card shadow-lg border-0 rounded-4">
                            <div className="card-header bg-primary text-white text-center py-4 rounded-top-4">
                                <h2 className="mb-0">
                                    <i className="bi bi-person-circle me-2"></i>
                                    Account Login
                                </h2>
                                <p className="mt-2 mb-0">Welcome back! Please sign in to your account</p>
                            </div>
                            <div className="card-body p-5">
                                {/* Role Selection */}
                                <div className="mb-4">
                                    <h5 className="text-center mb-3">Select Your Role</h5>
                                    <div className="d-flex justify-content-center gap-3 flex-wrap">
                                        {["resident", "admin", "manager"].map((role) => (
                                            <button
                                                key={role}
                                                onClick={() => handleRoleSelection(role)}
                                                className={`btn ${selectedRole === role ? 'btn-primary' : 'btn-outline-primary'} rounded-pill px-4`}
                                            >
                                                <i className={`bi ${role === 'admin' ? 'bi-shield-check' : role === 'manager' ? 'bi-person-badge' : 'bi-house-door'} me-2`}></i>
                                                {role.charAt(0).toUpperCase() + role.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">
                                            <i className="bi bi-envelope me-1"></i>Email address
                                        </label>
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                <i className="bi bi-person"></i>
                                            </span>
                                            <input
                                                type="email"
                                                className="form-control"
                                                id="email"
                                                placeholder="name@example.com"
                                                value={email}
                                                onChange={handleEmail}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="password" className="form-label">
                                            <i className="bi bi-key me-1"></i>Password
                                        </label>
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                <i className="bi bi-lock"></i>
                                            </span>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className="form-control"
                                                id="password"
                                                placeholder="Enter your password"
                                                value={password}
                                                onChange={handlePassword}
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={togglePasswordVisibility}
                                            >
                                                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                            </button>
                                        </div>
                                        <div className="form-text">
                                            Must be at least 8 characters long
                                        </div>
                                    </div>

                                    <div className="mb-3 form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="rememberMe"
                                        />
                                        <label className="form-check-label" htmlFor="rememberMe">
                                            Remember me
                                        </label>
                                        <a href="#" className="float-end text-decoration-none">
                                            Forgot password?
                                        </a>
                                    </div>

                                    <div className="d-grid">
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-lg rounded-pill py-2"
                                        >
                                            <i className="bi bi-box-arrow-in-right me-2"></i>
                                            Sign In
                                        </button>
                                    </div>
                                </form>

                                <div className="text-center mt-4">
                                    <p className="mb-2">Or sign in with</p>
                                    <div className="d-flex justify-content-center gap-3">
                                        <button className="btn btn-outline-danger rounded-circle p-2">
                                            <i className="bi bi-google"></i>
                                        </button>
                                        <button className="btn btn-outline-primary rounded-circle p-2">
                                            <i className="bi bi-facebook"></i>
                                        </button>
                                        <button className="btn btn-outline-dark rounded-circle p-2">
                                            <i className="bi bi-github"></i>
                                        </button>
                                    </div>
                                </div>

                                <hr className="my-4"/>

                                <div className="text-center">
                                    <p className="mb-0">
                                        Don't have an account?{" "}
                                        <a href="#" className="text-decoration-none">
                                            Sign up
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Bootstrap Icons */}
            <link
                rel="stylesheet"
                href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css"
            />
        </div>
    );
}

export default LoginFrom;