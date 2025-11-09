import React, { useEffect, useState } from "react";
import {complaintApi, updateStatus} from "../../services/api";

export default function AssignedComplaintsPage({ staffId }) {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const response = await complaintApi.getComplaintsByStaff(staffId);
        console.log("Complaints for staff:", response.data);
        setComplaints(response.data);
      } catch (err) {
        console.error("Error fetching complaints:", err);
        setError("Failed to load complaints");
      } finally {
        setLoading(false);
      }
    };

    if (staffId) fetchComplaints();
  }, [staffId]);

    const handleStatusChange = async (complaintId, newStatus) => {
        try {
            console.log("Updating complaint", complaintId, "to", newStatus);
            const response = await updateStatus(complaintId, newStatus);
            console.log("Response from server:", response.data);

            setComplaints((prev) =>
                prev.map((c) =>
                    c.complaint_id === complaintId ? {...c, status: newStatus} : c
                )
            );
        } catch (err) {
            console.error("Failed to update status:", err.response || err);
            alert("Failed to update status. See console for details.");
        }
    };


  if (loading) return <p>Loading complaints...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-4">
      <h3>Complaints Assigned to Staff</h3>
      {complaints.filter(c => c.status !== "Resolved").length === 0 ? (
  <div
    className="justify-content-center align-items-center animate__animated animate__fadeIn"
    style={{
      height: "50vh",
      color: "#000",
      fontSize: "1.6rem",
      fontWeight: "bold",
      textShadow: "0 0 10px rgba(255,191,0,0.8)",
    }}
  >
    <p>No Complaints Yet 😊</p>
  </div>
) : (
  <table className="table table-bordered">
    <thead className="table-dark">
      <tr>
        <th>Complaint ID</th>
        <th>Description</th>
        <th>Category</th>
        <th>Status</th>
        <th>Date</th>
      </tr>
    </thead>
    <tbody>
      {complaints
        .filter(c => c.status !== "Resolved")
        .map((c, index) => (
          <tr key={index}>
            <td>{c.complaint_id}</td>
            <td>{c.description}</td>
            <td>{c.category}</td>
            <td>
              <select
                className="form-select form-select-sm"
                value={c.status}
                onChange={(e) =>
                  handleStatusChange(c.complaint_id, e.target.value)
                }
              >
                <option value="Pending">Pending</option>
                <option value="Resolved">Resolved</option>
              </select>
            </td>
            <td>{c.created_at}</td>
          </tr>
        ))}
    </tbody>
  </table>
)}

    </div>
  );
}
