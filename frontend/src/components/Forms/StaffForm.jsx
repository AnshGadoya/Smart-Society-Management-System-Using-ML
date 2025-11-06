import React, {useState} from "react";
import {departmentOptions, positionOptions, statusOptions} from "../../utils/constants/appConstants";

function StaffForm({onAddStaff}) {
    const [formData, setFormData] = useState({
        staff_id: "",
        name: "",
        email: "",
        phone: "",
        department: "",
        position: "",
        hire_date: "",
        address: "",
        emergency_contact: "",
        emergency_phone: "",
        status: "active",
        photo: "",
        qualifications: ""
    });

    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({
            ...formData, [name]: value
        });

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({
                ...errors, [name]: ""
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
        if (!formData.department) newErrors.department = "Department is required";
        if (!formData.position) newErrors.position = "Position is required";
        if (!formData.hire_date) newErrors.hire_date = "Hire date is required";
        if (!formData.address.trim()) newErrors.address = "Address is required";

        // Basic email validation
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email address is invalid";
        }else if (formData.phone.length !== 10){
            newErrors.phone = "Phone Number must be 10";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            const staffData = {
                ...formData, // Generate a staff ID if not provided (in real app, this would come from backend)
                staff_id: formData.staff_id || `STAFF-${Date.now()}-${Math.floor(Math.random() * 1000)}`
            };

            // Call the function passed as prop to handle the staff data
            if (onAddStaff) {
                onAddStaff(staffData);
            }

            setSubmitted(true);

            // Reset form after 2 seconds
            setTimeout(() => {
                setFormData({
                    staff_id: "",
                    name: "",
                    email: "",
                    phone: "",
                    department: "",
                    position: "",
                    hire_date: "",
                    address: "",
                    emergency_contact: "",
                    emergency_phone: "",
                    status: "active",
                    photo: "",
                    qualifications: ""
                });
                setSubmitted(false);
            }, 2000);
        }
    };

    // Get positions based on selected department
    const getPositionOptions = () => {
        return positionOptions[formData.department] || [{value: "", label: "First select a department"}];
    };

    return (<div className="container mt-4">
        <div className="row justify-content-center">
            <div className="col-lg-10">
                <div className="card shadow">
                    <div className="card-header bg-success text-white">
                        <h4 className="mb-0">
                            <i className="bi bi-person-plus me-2"></i>
                            Add New Staff Member
                        </h4>
                    </div>
                    <div className="card-body">
                        {submitted && (<div className="alert alert-success" role="alert">
                            <i className="bi bi-check-circle-fill me-2"></i>
                            Staff member added successfully!
                        </div>)}

                        <form onSubmit={handleSubmit}>
                            <div className="row">


                                <div className="col-md-6 mb-3">
                                    <label htmlFor="name" className="form-label">Full Name*</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter full name"
                                    />
                                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="email" className="form-label">Email Address*</label>
                                    <input
                                        type="email"
                                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="staff@example.com"
                                    />
                                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label htmlFor="phone" className="form-label">Phone Number*</label>
                                    <input
                                        type="tel"
                                        className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+91 12345 67890"

                                        maxLength="10"
                                    />
                                    {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="department" className="form-label">Department*</label>
                                    <select
                                        className={`form-select ${errors.department ? 'is-invalid' : ''}`}
                                        id="department"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                    >
                                        {departmentOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>))}
                                    </select>
                                    {errors.department && <div className="invalid-feedback">{errors.department}</div>}
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label htmlFor="position" className="form-label">Position*</label>
                                    <select
                                        className={`form-select ${errors.position ? 'is-invalid' : ''}`}
                                        id="position"
                                        name="position"
                                        value={formData.position}
                                        onChange={handleChange}
                                        disabled={!formData.department}
                                    >
                                        {getPositionOptions().map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>))}
                                    </select>
                                    {errors.position && <div className="invalid-feedback">{errors.position}</div>}
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="hire_date" className="form-label">Hire Date*</label>
                                    <input
                                        type="date"
                                        className={`form-control ${errors.hire_date ? 'is-invalid' : ''}`}
                                        id="hire_date"
                                        name="hire_date"
                                        value={formData.hire_date}
                                        onChange={handleChange}
                                    />
                                    {errors.hire_date && <div className="invalid-feedback">{errors.hire_date}</div>}
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label htmlFor="status" className="form-label">Employment Status*</label>
                                    <select
                                        className="form-select"
                                        id="status"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                    >
                                        {statusOptions.map(option => (<option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>))}
                                    </select>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label htmlFor="address" className="form-label">Address*</label>
                                <textarea
                                    className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                    id="address"
                                    name="address"
                                    rows="3"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Full residential address"
                                ></textarea>
                                {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="emergency_contact" className="form-label">Emergency Contact
                                        Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="emergency_contact"
                                        name="emergency_contact"
                                        value={formData.emergency_contact}
                                        onChange={handleChange}
                                        placeholder="Name of emergency contact"
                                    />
                                </div>

                                <div className="col-md-6 mb-3">
                                    <label htmlFor="emergency_phone" className="form-label">Emergency Contact
                                        Phone</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        id="emergency_phone"
                                        name="emergency_phone"
                                        value={formData.emergency_phone}
                                        onChange={handleChange}
                                        placeholder="Emergency phone number"
                                    />
                                </div>
                            </div>

                            <div className="row">


                                <div className="col-md-6 mb-3">
                                    <label htmlFor="qualifications"
                                           className="form-label">Qualifications/Certifications</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="qualifications"
                                        name="qualifications"
                                        value={formData.qualifications}
                                        onChange={handleChange}
                                        placeholder="Relevant qualifications"
                                    />
                                </div>
                            </div>

                            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                <button type="reset" className="btn btn-outline-secondary me-md-2">
                                    <i className="bi bi-arrow-repeat me-2"></i>
                                    Reset Form
                                </button>
                                <button type="submit" className="btn btn-success">
                                    <i className="bi bi-person-plus me-2"></i>
                                    Add Staff Member
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>);
}

export default StaffForm;