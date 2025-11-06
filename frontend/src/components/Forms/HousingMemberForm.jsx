// src/components/Forms/HousingMemberForm.jsx
import React, {useEffect, useState} from "react";
import {blockApi, housingApi} from "../../services/api";
import {relationshipOptions} from "../../utils/constants/appConstants";

function HousingMemberForm({onAddMember}) {
    const [formData, setFormData] = useState({
        member_id: "",
        name: "",
        email: "",
        phone: "",
        relationship: "",
        date_of_birth: "",
        aadhar_number: "",
        is_primary: false,
        occupation: "",
        move_in_date: "",
        move_out_date: "",
        status: "active",
        block_id: "",
        unit_id: "",
    });

    const [blocks, setBlocks] = useState([]);
    const [units, setUnits] = useState([]);
    const [allUnits, setAllUnits] = useState([]);
    const [errors, setErrors] = useState({});


    useEffect(() => {
        const fetchHousingUnits = async () => {
            try {

                const data = await housingApi.getHousing();
                console.log("Fetched housing units:", data); // ← check this
                setAllUnits(data);

                const uniqueBlocks = Array.from(new Map(data.map(u => [u.block_id, {
                    id: u.block_id,
                    name: u.block_name
                }])).values());
                console.log("Unique blocks:", uniqueBlocks); // ← check this too
                setBlocks(uniqueBlocks);
            } catch (error) {
                console.error("Error fetching housing units:", error);
            }
        };
        fetchHousingUnits();
    }, []);

    useEffect(() => {
        if (formData.block_id) {
            const filteredUnits = allUnits.filter(unit => unit.block_id === parseInt(formData.block_id));
            setUnits(filteredUnits);
        } else {
            setUnits([]);
        }
    }, [formData.block_id, allUnits]);

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        setFormData({
            ...formData, [name]: type === "checkbox" ? checked : value
        });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = "Name is required";
        if (!formData.relationship) newErrors.relationship = "Relationship is required";
        if (!formData.block_id) newErrors.block_id = "Block is required";
        if (!formData.unit_id) newErrors.unit_id = "Unit is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const memberData = {
            ...formData, member_id: formData.member_id || `MEM-${Date.now()}-${Math.floor(Math.random() * 1000)}`
        };
        onAddMember(memberData);

        setFormData({
            member_id: "",
            name: "",
            email: "",
            phone: "",
            relationship: "",
            date_of_birth: "",
            aadhar_number: "",
            is_primary: false,
            occupation: "",
            move_in_date: "",
            move_out_date: "",
            status: "active",
            block_id: "",
            unit_id: "",
        });
    };

    return (<div className="card my-3 p-3 shadow">
            <h5>Add Housing Member</h5>
            <form onSubmit={handleSubmit}>
                <div className="row g-3">
                    {/* Block Dropdown */}
                    <div className="col-md-6">
                        <label>Block*</label>
                        <select
                            className={`form-select ${errors.block_id ? "is-invalid" : ""}`}
                            name="block_id"
                            value={formData.block_id}
                            onChange={handleChange}
                        >
                            <option value="">Select Block</option>
                            {blocks.map(block => (<option key={block.id} value={block.id}>{block.name}</option>))}
                        </select>
                        {errors.block_id && <div className="invalid-feedback">{errors.block_id}</div>}
                    </div>

                    {/* Unit Dropdown */}
                    <div className="col-md-6">
                        <label>Unit*</label>
                        <select
                            className={`form-select ${errors.unit_id ? "is-invalid" : ""}`}
                            name="unit_id"
                            value={formData.unit_id}
                            onChange={handleChange}
                        >
                            <option value="">Select Unit</option>
                            {units.map(unit => (<option key={unit.id} value={unit.id}>
                                    {unit.unit_number} ({unit.type})
                                </option>))}
                        </select>
                        {errors.unit_id && <div className="invalid-feedback">{errors.unit_id}</div>}
                    </div>

                    {/* Name */}
                    <div className="col-md-6">
                        <label>Name*</label>
                        <input
                            type="text"
                            className={`form-control ${errors.name ? "is-invalid" : ""}`}
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>

                    {/* Relationship Dropdown */}
                    <div className="col-md-6">
                        <label>Relationship*</label>
                        <select
                            className={`form-select ${errors.relationship ? "is-invalid" : ""}`}
                            name="relationship"
                            value={formData.relationship}
                            onChange={handleChange}
                        >
                            <option value="">Select Relationship</option>
                            {relationshipOptions.map(rel => (<option key={rel} value={rel}>{rel}</option>))}
                        </select>
                        {errors.relationship && <div className="invalid-feedback">{errors.relationship}</div>}
                    </div>

                    {/* Email */}
                    <div className="col-md-6">
                        <label>Email</label>
                        <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Phone */}
                    <div className="col-md-6">
                        <label>Phone</label>
                        <input
                            type="text"
                            className="form-control"
                            name="phone"
                            value={formData.phone}
                            maxLength={10} // restrict typing to 10
                            onChange={(e) => {
                                // Only allow numbers, trim to 10 digits
                                const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 10);
                                handleChange({target: {name: 'phone', value}});
                            }}
                        />
                    </div>

                    {/* DOB */}
                    <div className="col-md-6">
                        <label>Date of Birth</label>
                        <input
                            type="date"
                            className="form-control"
                            name="date_of_birth"
                            value={formData.date_of_birth}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Aadhaar */}
                    <div className="col-md-6">
                        <label>Aadhar Number</label>
                        <input
                            type="text"
                            className="form-control"
                            name="aadhar_number"
                            maxLength={12}
                            value={formData.aadhar_number}
                            onChange={(e) => {
                                // Allow only numbers, max 12 digits
                                const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 12);
                                handleChange({target: {name: 'aadhar_number', value}});
                            }}
                        />
                    </div>

                    {/* Occupation */}
                    <div className="col-md-6">
                        <label>Occupation</label>
                        <input
                            type="text"
                            className="form-control"
                            name="occupation"
                            value={formData.occupation}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Status */}
                    <div className="col-md-6">
                        <label>Status</label>
                        <select
                            className="form-select"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="moved_out">Moved Out</option>
                            <option value="deceased">Deceased</option>
                        </select>
                    </div>

                    {/* Primary Member */}
                    <div className="col-12">
                        <div className="form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                name="is_primary"
                                checked={formData.is_primary}
                                onChange={handleChange}
                            />
                            <label className="form-check-label">Primary Member</label>
                        </div>
                    </div>

                    <div className="col-12 text-end">
                        <button type="submit" className="btn btn-primary mt-2">Add Member</button>
                    </div>
                </div>
            </form>
        </div>);
}

export default HousingMemberForm;
