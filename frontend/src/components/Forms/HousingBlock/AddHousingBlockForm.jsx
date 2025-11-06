import React, { useState } from "react";
import { housingApi } from "../../../services/api";
import { unitTypes } from "../../../utils/constants/appConstants";

function AddHousingBlockForm({ blocks, onSuccess }) {
    const [selectedBlock, setSelectedBlock] = useState("");
    const [flats, setFlats] = useState([{ flatNumber: "", type: unitTypes[0] }]);

    const handleFlatNumberChange = (index, value) => {
        const updatedFlats = [...flats];
        updatedFlats[index].flatNumber = value;
        setFlats(updatedFlats);
    };

    const handleTypeChange = (index, value) => {
        const updatedFlats = [...flats];
        updatedFlats[index].type = value;
        setFlats(updatedFlats);
    };

    const addFlat = () => setFlats([...flats, { flatNumber: "", type: "1BHK" }]);
    const removeFlat = (index) => {
        if (flats.length > 1) setFlats(flats.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedBlock) return alert("Please select a block!");

        const housingUnitsData = flats.map((flat) => ({
            block_id: selectedBlock,
            unit_number: flat.flatNumber,
            type: flat.type,
        }));
        console.log("housingUnitsData",housingUnitsData);
        try {

            await housingApi.addHousing(housingUnitsData);
            alert("Housing units added successfully");
            setSelectedBlock("");
            setFlats([{ flatNumber: "", type: "1BHK" }]);
            onSuccess && onSuccess();
        } catch (error) {
            console.error(error);
            alert("Failed to add housing units");
        }
    };

    return (
        <div className="container mt-4">
            <form onSubmit={handleSubmit}>
                <h4 className="mb-4">Add Flats to Block</h4>
                <div className="mb-3">
                    <label className="form-label">Select Block</label>
                    <select
                        className="form-select"
                        value={selectedBlock}
                        onChange={(e) => setSelectedBlock(e.target.value)}
                        required
                    >
                        <option value="">Select Block</option>
                        {blocks.map((block) => (
                            <option key={block.id} value={block.id}>
                                { block.block_name}
                            </option>
                        ))}
                    </select>
                </div>

                {flats.map((flat, index) => (
                    <div className="row g-3 mb-3 align-items-center" key={index}>
                        <div className="col-md-5">
                            <input
                                type="text"
                                className="form-control"
                                placeholder={`Flat Number ${index + 1}`}
                                value={flat.flatNumber}
                                onChange={(e) => handleFlatNumberChange(index, e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-md-5">
                            <select
                                className="form-select"
                                value={flat.type}
                                onChange={(e) => handleTypeChange(index, e.target.value)}
                            >
                                {unitTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-2 ">
                             <button type="button" className="btn btn-outline-primary mx-2" onClick={addFlat}>
                                Add
                            </button>
                            {index !==  0 &&
                                <button type="button" className="btn btn-outline-danger" onClick={() => removeFlat(index)}>
                                    Remove
                                </button>
                            }
                        </div>
                    </div>
                ))}

                <div className="d-grid">
                    <button type="submit" className="btn btn-primary">
                        Save All Flats
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddHousingBlockForm;
