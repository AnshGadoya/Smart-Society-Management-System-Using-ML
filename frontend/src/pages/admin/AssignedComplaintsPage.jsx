import React, { useEffect, useState } from "react";
import {complaintApi, updateStatus} from "../../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ important import


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

      const hasNoComplaints = complaints.filter(c => c.status !== "Resolved").length === 0;

const generatePDF = () => {
  if (hasNoComplaints) {
    alert("No complaints available to download!");
    return;
  }

    console.log("Generating PDF for complaints:", complaints);
    console.log("complaints.length === 0:", complaints.length === 0);

  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Assigned Complaints Report", 14, 20);

  const tableColumn = ["Complaint ID", "Description", "Category", "Status", "Date"];
  const tableRows = complaints.map(c => [
    c.complaint_id,
    c.description,
    c.category,
    c.status,
    c.created_at,
  ]);

  // ✅ use like this — pass doc as first argument
  autoTable(doc, {
    startY: 30,
    head: [tableColumn],
    body: tableRows,
    theme: "grid",
    headStyles: { fillColor: [0, 0, 0] },
    alternateRowStyles: { fillColor: [240, 240, 240] },
  });

  doc.save("complaints_report.pdf");
};


  if (loading) return <p>Loading complaints...</p>;
  if (error) return <p className="text-danger">{error}</p>;



  return (
    <div className="container mt-4">
      <h3>Complaints Assigned to Staff</h3>
        <div className="d-flex justify-content-end mb-3">
            <button
                onClick={generatePDF}
                // disabled={hasComplaints}
                className="btn btn-dark px-4 py-2 my-3"
                style={{
                    background: hasNoComplaints
                        ? "gray"
                        : "linear-gradient(90deg, #000000, #434343)",
                    color: "gold",
                    borderRadius: "10px",
                    boxShadow: "0 0 10px rgba(255,215,0,0.5)",
                    cursor: hasNoComplaints ? "not-allowed" : "pointer",
                    transition: "all 0.3s ease",
                }}
            >
                📄 Download PDF
            </button>

        </div>

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
