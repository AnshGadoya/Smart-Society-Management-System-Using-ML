import React, { useState, useEffect } from "react";

function EditHousingBlockForm({ item, blocks = [], onSave, onCancel }) {
    const [formData, setFormData] = useState({
        id: "",
        block_id: "",
        unit_number: "",
        type: "1BHK",
    });

    useEffect(() => {
        if (item) {
            setFormData({
                id: item.id,
                block_id: item.block_id || "",
                unit_number: item.unit_number || "",
                type: item.type || "1BHK",
            });
        }
    }, [item]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!item) return null;

    return (
        <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">

                    {/* Modal Header */}
                    <div className="modal-header">
                        <h5 className="modal-title">Edit Housing Unit</h5>
                        <button type="button" className="btn-close" onClick={onCancel}></button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">

                            {/* Block Name Dropdown */}
                            <div className="mb-3">
                                <label className="form-label">Block Name</label>
                                <select
                                    className="form-select"
                                    name="block_id"
                                    value={formData.block_id}
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

                            {/* Unit Number */}
                            <div className="mb-3">
                                <label className="form-label">Unit Number</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="unit_number"
                                    value={formData.unit_number}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Type */}
                            <div className="mb-3">
                                <label className="form-label">Type</label>
                                <select
                                    className="form-select"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="1BHK">1BHK</option>
                                    <option value="2BHK">2BHK</option>
                                    <option value="3BHK">3BHK</option>
                                </select>
                            </div>

                        </div>

                        {/* Modal Footer */}
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

export default EditHousingBlockForm;
