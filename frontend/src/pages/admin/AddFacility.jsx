import React, {useState} from "react";
import PageHeader from "../../layout/PageHeader";
import HousingTable from "../../components/TableView/HousingTable";

function AddFacility() {
    const [addFacility, setAddFacility] = useState([{name: "", price: "", unit: ""}])
    const [facilities, setFacility] = useState([])

    function handleNameChange(index, value) {
        const updateFacility = [...addFacility];
        updateFacility[index].name = value;
        setAddFacility(updateFacility);
    }

    function handlePriceChange(index, value) {
        const updateFacility = [...addFacility];
        updateFacility[index].price = value;
        setAddFacility(updateFacility);

    }

    function handleUnitChange(index, value) {
        const updateFacility = [...addFacility];
        updateFacility[index].unit = value;
        setAddFacility(updateFacility);
    }

    function handleSubmit(e) {
        e.preventDefault();
        setFacility([...facilities, ...addFacility]);
        console.log("addFacility:", addFacility);
        setAddFacility([{name: "", price: "", unit: ""}]);
        console.log("setAddFacility:", setAddFacility);

    }

    const facilityColumns = [{header: "Facility Name", accessor: "name"}, {
        header: "Rent",
        accessor: "price"
    }, {header: "Unit", accessor: "unit"},]

    return (// <div className="mb-3">
        //     <input type="text" onChange={(e)=>(handleSubmit(e.target.value))} value={addFacility} placeholder="Add Facility"/>
        //     <p>{addFacility}</p>
        // </div>
        <div className="container">
            <PageHeader PageTitle={"Add Amenities"}/>
            <div className="row">
                <div className="container mt-4">
                    <div className="col-lg-12">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                {addFacility.map((facility, index) => (
                                    <div key={index} className="row g-3 mb-3 align-items-center">
                                        <div className="col-lg-6">
                                            <div className="mb-3">
                                                <label className="form-label">Facility Name <span
                                                    className="text-danger">*</span></label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={facility.name}
                                                    onChange={(e) => handleNameChange(index, e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="mb-3">
                                                <label className="form-label">Price <span
                                                    className="text-danger">*</span></label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={facility.price}
                                                    onChange={(e) => handlePriceChange(index, e.target.value)}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-4">
                                            <div className="mb-3">
                                                <label className="form-label">
                                                    Unit <span className="text-danger">*</span>
                                                </label>
                                                <select
                                                    className="form-select"
                                                    value={facility.unit}
                                                    onChange={(e) => handleUnitChange(index, e.target.value)}
                                                    required
                                                >
                                                    <option value="">Select Unit</option>
                                                    <option value="per day">Per Day</option>
                                                    <option value="per hour">Per Hour</option>
                                                    <option value="per movie">Per Movie</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div>
                                            <button type="submit" className="btn btn-primary">Add Facility</button>
                                        </div>
                                    </div>))}

                            </div>
                        </form>
                    </div>
                </div>
                <div className="col-12 mt-3">
                    <HousingTable
                        data={facilities}
                        columns={facilityColumns}
                    />
                </div>
            </div>
        </div>


    );
}

export default AddFacility