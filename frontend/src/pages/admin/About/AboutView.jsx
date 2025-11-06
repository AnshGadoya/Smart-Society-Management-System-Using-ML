import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./about.css"; // custom styles for parallax

function AboutView() {
    return (<div className="about-page">
            {/* Hero Section with Parallax */}
            <section
                className="parallax d-flex flex-column justify-content-center align-items-center text-white text-center"
                data-aos="fade-down"
            >
                <h1 className="display-3 fw-bold">Smart Society Management System</h1>
                <p className="lead mt-3">
                    A smarter way to manage your society with technology 🚀
                </p>
            </section>

            {/* Our Mission */}
            <section className="container py-5">
                <div className="row align-items-center">
                    <div className="col-md-6" data-aos="fade-right">
                        <img
                            src="/mission.png"
                            alt="mission"
                            className="img-fluid rounded shadow"
                        />
                    </div>
                    <div className="col-md-6" data-aos="fade-left">
                        <h2 className="fw-bold">Our Mission</h2>
                        <p className="text-muted">
                            Our system is designed to simplify daily society tasks like
                            complaint management, visitor verification, utility tracking, and
                            online payments. With AI-powered tools, we ensure efficiency,
                            transparency, and security for residents and administrators.
                        </p>
                    </div>
                </div>
            </section>

            {/* Features Section with Parallax */}
            <section className="parallax2 text-center text-white py-5">
                <div className="container">
                    <h2 className="fw-bold mb-5" data-aos="zoom-in">
                        Key Features
                    </h2>
                    <div className="row g-4">
                        <div className="col-md-4" data-aos="flip-left">
                            <div className="card h-100 shadow border-0">
                                <div className="card-body text-center">
                                    <h5 className="card-title">Complaint Categorizer</h5>
                                    <p className="card-text text-muted">
                                        AI-powered complaint classification for faster response.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4" data-aos="flip-up">
                            <div className="card h-100 shadow border-0">
                                <div className="card-body text-center">
                                    <h5 className="card-title">Visitor Verifier</h5>
                                    <p className="card-text text-muted">
                                        Face recognition-based visitor verification system.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4" data-aos="flip-right">
                            <div className="card h-100 shadow border-0">
                                <div className="card-body text-center">
                                    <h5 className="card-title">Utility Monitor</h5>
                                    <p className="card-text text-muted">
                                        Detect anomalies in water & electricity usage with ML.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Developer Section */}
            <section
                className="text-center bg-dark text-white py-5"
                data-aos="fade-up"
            >
                <h2 className="fw-bold">Made with ❤️ by AS Developer</h2>
                <p className="mt-2">Your trusted software development partner</p>
            </section>
        </div>);
}

export default AboutView;
