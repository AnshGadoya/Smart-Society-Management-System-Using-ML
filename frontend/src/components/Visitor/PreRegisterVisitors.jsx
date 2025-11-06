import React, { useState } from "react";
import {visitorsApi} from "../../services/api";

function PreRegisterVisitorsWithCode() {
    const [visitors, setVisitors] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        visitDate: "",
        purpose: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.visitDate) {
            alert("Please fill in all required fields.");
            return;
        }
        const response = await visitorsApi.addVisitor(formData);
        if (response?.data) {
            alert(response.data.status || "Visitor submitted");
        }

        // const visitorWithCode = {...formData, code: generateCode()};
        // setVisitors([...visitors, visitorWithCode]);
        setFormData({name: "", email: "", phone: "", visitDate: "", purpose: ""});
    };

    return (
        <div className="container mt-5">
            <div className="row">
                {/* Form Section */}
                <div className="col-lg-12 mb-4">
                    <div className="card shadow-sm p-3">
                        <h5 className="mb-3">Visitor Registration Form</h5>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label>Name*</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label>Email*</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label>Phone</label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label>Visit Date*</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    name="visitDate"
                                    value={formData.visitDate}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label>Purpose</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="purpose"
                                    value={formData.purpose}
                                    onChange={handleChange}
                                />
                            </div>

                            <button type="submit" className="btn btn-primary w-100">
                                Pre-register
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default PreRegisterVisitorsWithCode;
