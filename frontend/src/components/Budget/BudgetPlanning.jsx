import React, { useState } from "react";

function BudgetPlanning() {
    const [budgets, setBudgets] = useState([
        { category: "Maintenance", allocated: 50000, spent: 32000 },
        { category: "Utilities", allocated: 30000, spent: 25000 },
        { category: "Events", allocated: 20000, spent: 18000 },
    ]);

    const [newBudget, setNewBudget] = useState({ category: "", allocated: "", spent: "" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewBudget({ ...newBudget, [name]: value });
    };

    const handleAddBudget = (e) => {
        e.preventDefault();
        if (!newBudget.category || !newBudget.allocated) {
            alert("Please fill category and allocated amount");
            return;
        }
        setBudgets([...budgets, { ...newBudget, allocated: Number(newBudget.allocated), spent: Number(newBudget.spent || 0) }]);
        setNewBudget({ category: "", allocated: "", spent: "" });
    };

    const handleDelete = (index) => {
        const updatedBudgets = budgets.filter((_, i) => i !== index);
        setBudgets(updatedBudgets);
    };

    return (
        <div className="container mt-5">
            <h3 className="mb-4 text-center">Budget Planning</h3>

            <div className="row">
                {/* Add Budget Form */}
                <div className="col-md-4 mb-4">
                    <div className="card shadow-sm p-3">
                        <h5>Add New Budget</h5>
                        <form onSubmit={handleAddBudget}>
                            <div className="mb-3">
                                <label className="form-label">Category</label>
                                <input
                                    type="text"
                                    name="category"
                                    className="form-control"
                                    value={newBudget.category}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Allocated Amount</label>
                                <input
                                    type="number"
                                    name="allocated"
                                    className="form-control"
                                    value={newBudget.allocated}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Spent Amount</label>
                                <input
                                    type="number"
                                    name="spent"
                                    className="form-control"
                                    value={newBudget.spent}
                                    onChange={handleChange}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100">Add Budget</button>
                        </form>
                    </div>
                </div>

                {/* Budget Table */}
                <div className="col-md-8">
                    <div className="card shadow-sm p-3">
                        <h5>Budget Overview</h5>
                        <div className="table-responsive">
                            <table className="table table-striped mt-3">
                                <thead>
                                <tr>
                                    <th>Category</th>
                                    <th>Allocated</th>
                                    <th>Spent</th>
                                    <th>Remaining</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {budgets.map((b, idx) => (
                                    <tr key={idx}>
                                        <td>{b.category}</td>
                                        <td>₹{b.allocated.toLocaleString()}</td>
                                        <td>₹{b.spent.toLocaleString()}</td>
                                        <td>₹{(b.allocated - b.spent).toLocaleString()}</td>
                                        <td>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDelete(idx)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BudgetPlanning;
