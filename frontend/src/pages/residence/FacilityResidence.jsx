import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Facility() {
  const [facility, setFacility] = useState("");
  const [name, setName] = useState("");
  const [flatNo, setFlatNo] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");

  const [facilities, setFacilities] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newFacility = {
      facility,
        name,
        flatNo,
      fromDate,
      toDate,
      fromTime,
      toTime,
    };

    setFacilities([...facilities, newFacility]);

    // reset
    setFacility("");
    setName("");
    setFlatNo("");
    setFromDate("");
    setToDate("");
    setFromTime("");
    setToTime("");
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Add Facility Booking</h2>
      <h2>THIS PAGE IS FOR RESIDENCE SO NO REMOVE </h2>

      {/* Facility Form */}
      <form className="row g-3" onSubmit={handleSubmit}>
        {/* Facility Name */}
        <div className="col-md-6">
          <label className="form-label">Facility</label>
          <select
            className="form-select"
            value={facility}
            onChange={(e) => setFacility(e.target.value)}
            required
          >
            <option value="">-- Select Facility --</option>
            <option value="Hall">Hall</option>
            <option value="Theater">Theater</option>
            <option value="Garden">Garden</option>
            <option value="Clubhouse">Clubhouse</option>
          </select>
        </div>

          {/* Name */}
        <div className="col-md-3">
            <label className="form-label">Name</label>
            <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
        </div>

          {/* Flat No */}
          <div className="col-md-3">
              <label className="form-label">Flat No.</label>
              <input
                type="text"
                className="form-control"
                value={flatNo}
                onChange={(e) => setFlatNo(e.target.value)}
                placeholder="A606"
                required
              />
          </div>

          {/* From Date */}
          <div className="col-md-3">
              <label className="form-label">From Date</label>
          <input
            type="date"
            className="form-control"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            required
          />
        </div>

        {/* To Date */}
        <div className="col-md-3">
          <label className="form-label">To Date</label>
          <input
            type="date"
            className="form-control"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            required
          />
        </div>

        {/* From Time */}
        <div className="col-md-3">
          <label className="form-label">From Time</label>
          <input
            type="time"
            className="form-control"
            value={fromTime}
            onChange={(e) => setFromTime(e.target.value)}
            required
          />
        </div>

        {/* To Time */}
        <div className="col-md-3">
          <label className="form-label">To Time</label>
          <input
            type="time"
            className="form-control"
            value={toTime}
            onChange={(e) => setToTime(e.target.value)}
            required
          />
        </div>

        {/* Submit Button */}
        <div className="col-12">
          <button type="submit" className="btn btn-primary">
            Add Facility
          </button>
        </div>
      </form>

      {/* Display Added Facilities */}
      <div className="mt-5">
        <h4>Booked Facilities</h4>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Facility</th>
              <th>Name</th>
              <th>Flat No</th>
              <th>From Date</th>
              <th>To Date</th>
              <th>From Time</th>
              <th>To Time</th>
            </tr>
          </thead>
          <tbody>
            {facilities.map((f, index) => (
              <tr key={index}>
                <td>{f.facility}</td>
                <td>{f.name}</td>
                <td>{f.flatNo}</td>
                <td>{f.fromDate}</td>
                <td>{f.toDate}</td>
                <td>{f.fromTime}</td>
                <td>{f.toTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Facility;

