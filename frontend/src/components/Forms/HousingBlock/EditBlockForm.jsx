import React, { useState, useEffect } from "react";

function EditBlockForm({ block, onSave, onCancel }) {
    const [form, setForm] = useState({ block_name: "", flat_count: 0 });

    useEffect(() => {
        if (block) {
            setForm({
                block_name: block.block_name || "",
                flat_count: block.flat_count || 0,
            });
        }
    }, [block]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === "flat_count" ? parseInt(value, 10) || 0 : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(form);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="form-label">Block Name</label>
                <input
                    type="text"
                    name="block_name"
                    value={form.block_name}
                    onChange={handleChange}
                    className="form-control"
                    required
                />
            </div>
            <div className="mb-3">
                <label className="form-label">Flat Count</label>
                <input
                    type="number"
                    name="flat_count"
                    value={form.flat_count}
                    onChange={handleChange}
                    className="form-control"
                    required
                />
            </div>
            <div className="d-flex justify-content-end">
                <button type="button" className="btn btn-secondary me-2" onClick={onCancel}>
                    Cancel
                </button>
                <button type="submit" className="btn btn-primary">Save</button>
            </div>
        </form>
    );
}

export default EditBlockForm;
