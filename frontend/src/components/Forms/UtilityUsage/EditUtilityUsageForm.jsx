import React, { useState, useEffect } from "react";

function EditUtilityUsageForm({ item, blocks = [], onSave, onCancel }) {
    const [formData, setFormData] = useState({ ...item });

    useEffect(() => {
        if (item) setFormData({ ...item });
    }, [item]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!item) return null;

    return (
        <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Edit Utility Record</h5>
                        <button type="button" className="btn-close" onClick={onCancel}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            {/* Date */}
                            <div className="mb-3">
                                <label className="form-label">Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    name="date"
                                    value={formData.date || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Block */}
                            <div className="mb-3">
                                <label className="form-label">Block</label>
                                <select
                                    className="form-select"
                                    name="block_id"
                                    value={formData.block_id || ""}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Block</option>
                                    {blocks.map((block) => (
                                        <option key={block.id} value={block.id}>
                                            {block.block_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Utility Type */}
                            <div className="mb-3">
                                <label className="form-label">Utility Type</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="utility_type"
                                    value={formData.utility_type || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Value */}
                            <div className="mb-3">
                                <label className="form-label">Value</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="value"
                                    value={formData.value || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Unit */}
                            <div className="mb-3">
                                <label className="form-label">Unit</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="unit"
                                    value={formData.unit || ""}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div className="mb-3">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-control"
                                    name="description"
                                    value={formData.description || ""}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onCancel}>
                                Close
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditUtilityUsageForm;
