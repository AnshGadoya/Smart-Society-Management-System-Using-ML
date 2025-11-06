import React, {useState} from "react";
import {blockApi} from "../../../services/api";

function AddBlockForm({onSuccess}) {
    const [blockName, setBlockName] = useState("");
    const [flatCount, setFlatCount] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!blockName || !flatCount) {
            alert("Please fill all fields");
            return;
        }

        try {
            const response = await blockApi.addBlock({
                block_name: blockName,
                flat_count: parseInt(flatCount, 10),
            });

            if (response) {
                alert(response.data.message || "Block created successfully!");
                setBlockName("");
                setFlatCount("");
                onSuccess && onSuccess(); // refresh list
            }
        } catch (err) {
            console.error("Error creating block", err);
            alert("Failed to create block");
        }
    };

    return (
        <div className="card shadow-sm p-3 mb-4">
            <h5 className="mb-3">Add New Block</h5>
            <form onSubmit={handleSubmit}>
                <div className="row g-3">

                    <div className="col-md-4">
                        <label className="form-label">Block Name</label>
                        <input
                            type="text"
                            className="form-control"
                            value={blockName}
                            onChange={(e) => setBlockName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="col-md-4">
                        <label className="form-label">Number of Flats</label>
                        <input
                            type="number"
                            className="form-control"
                            value={flatCount}
                            onChange={(e) => setFlatCount(e.target.value)}
                            required
                        />
                    </div>
                    <div className="col-md-4">
                        <button type="submit" className="btn btn-primary">
                            Save Block
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default AddBlockForm;
