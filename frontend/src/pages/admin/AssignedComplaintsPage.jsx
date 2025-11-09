import React, { useEffect, useState } from "react";
import { complaintApi } from "../../services/api";

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

  if (loading) return <p>Loading complaints...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-4">
      <h3>Complaints Assigned to Staff</h3>
      {complaints.length === 0 ? (
        <p className="text-muted">No complaints assigned yet</p>
      ) : (
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Complaint ID</th>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((c, index) => (
              <tr key={index}>
                <td>{c.complaint_id}</td>
                <td>{c.title}</td>
                <td>{c.category}</td>
                <td>{c.status}</td>
                <td>{c.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
