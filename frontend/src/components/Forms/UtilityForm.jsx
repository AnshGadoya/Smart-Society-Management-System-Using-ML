import React, {useState} from "react";

function UtilityForm() {
    const [form, setForm] = useState({
        date: "",
        block_id: "",
        utility_type: "",
        usage: "",
        description: "",
        bill: null
    });

    const handleChange = (e) => {
        const {name, value, files} = e.target;
        if (name === "bill") {
            setForm({...form, bill: files[0]}); // store file
        } else {
            setForm({...form, [name]: value});
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Using FormData for file upload
        const formData = new FormData();
        Object.keys(form).forEach((key) => {
            formData.append(key, form[key]);
        });

        // Example: Send to API
        // await fetch("http://localhost:5000/add_usage", {
        //     method: "POST",
        //     body: formData,
        // });

        alert("Utility usage added successfully!");
    };

    return (
        <div className="container mt-4">
            <div className="card shadow-sm">
                <div className="card-header bg-primary text-white">
                    <h4 className="mb-0">Enter Utility Usage</h4>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Date</label>
                            <input
                                type="date"
                                className="form-control"
                                name="date"
                                value={form.date}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Block</label>
                            <select
                                className="form-select"
                                name="block_id"
                                value={form.block_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Block</option>
                                <option value="A">Block A</option>
                                <option value="B">Block B</option>
                                <option value="C">Block C</option>
                                <option value="D">Block D</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Utility Type</label>
                            <select
                                className="form-select"
                                name="utility_type"
                                value={form.utility_type}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Utility</option>
                                <option value="water">Water</option>
                                <option value="electricity">Electricity</option>
                                <option value="gas">Gas</option>
                                <option value="maintenance_charges">Maintenance</option>
                                <option value="waste">Waste</option>
                                <option value="internet">Internet</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Usage</label>
                            <input
                                type="number"
                                className="form-control"
                                name="usage"
                                placeholder="Enter usage value"
                                value={form.usage}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Description</label>
                            <input
                                type="text"
                                className="form-control"
                                name="description"
                                placeholder="Enter description"
                                value={form.description}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Upload Bill (Optional)</label>
                            <input
                                type="file"
                                className="form-control"
                                name="bill"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={handleChange}
                            />
                            {form.bill && (
                                <small className="text-muted">
                                    Selected File: {form.bill.name}
                                </small>
                            )}
                        </div>

                        <button type="submit" className="btn btn-success w-100">
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UtilityForm;