import React, {useState, useEffect} from "react";
import {blockApi, utilityApi} from "../../../services/api";
import {utilityTypes} from "../../../utils/constants/appConstants";


function AddUtilityUsageForm({onSuccess}) {
    const [blocks, setBlocks] = useState([]);
    const [formData, setFormData] = useState({
        date: "",
        block_id: "",
        utility_type: "",
        value: "",
        description: "",
    });

    useEffect(() => {
        const fetchBlocks = async () => {
            try {
                const res = await blockApi.getBlocks();
                setBlocks(res || []);
            } catch (err) {
                console.error("Failed to fetch blocks in utilityForm:", err);
            }
        };
        fetchBlocks();
    }, []);

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.date || !formData.block_id || !formData.utility_type || !formData.value) {
            return alert("Please fill all required fields");
        }

        // Assign unit automatically based on type
        const unit = utilityTypes.find(u => u.type === formData.utility_type)?.unit || "";

        try {
            const response = await utilityApi.addUtility({
                ...formData,
                value: parseFloat(formData.value),
                unit,
            });
            alert(response.data.message || "Utility usage added");
            setFormData({date: "", block_id: "", utility_type: "", value: "", description: ""});
            onSuccess && onSuccess();
        } catch (err) {
            console.error(err);
            alert("Failed to add utility usage");
        }
    };

    return (
        <div className="container mt-4">
            <form onSubmit={handleSubmit}>
                <h4 className="mb-4">Add Utility Usage</h4>

                <div className="mb-3">
                    <label className="form-label">Date</label>
                    <input
                        type="date"
                        className="form-control"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Select Block</label>
                    <select
                        className="form-select"
                        name="block_id"
                        value={formData.block_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Block</option>
                        {blocks.map(block => (
                            <option key={block.id} value={block.id}>
                                {block.block_name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Utility Type</label>
                    <select
                        className="form-select"
                        name="utility_type"
                        value={formData.utility_type}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Utility</option>
                        {utilityTypes.map(u => (
                            <option key={u.type} value={u.type}>
                                {u.type} ({u.unit})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Value</label>
                    <input
                        type="number"
                        className="form-control"
                        name="value"
                        value={formData.value}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Description (Optional)</label>
                    <textarea
                        className="form-control"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit" className="btn btn-primary">Add Utility Usage</button>
            </form>
        </div>
    );
}

export default AddUtilityUsageForm;
