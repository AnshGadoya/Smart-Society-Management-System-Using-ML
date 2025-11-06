import React, {useState, useEffect} from "react";
import StaffForm from "../../components/Forms/StaffForm";
import {staffApi} from "../../services/api";


function StaffManagementPage() {
    const [staffMembers, setStaffMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch staff data from backend
    useEffect(() => {
        const fetchStaff = async () => {
            try {
                setLoading(true);
                const data = await staffApi.getStaff();
                console.log("data getStaff", data);
                setStaffMembers(data);
            } catch (err) {
                setError("Failed to fetch staff members");
                console.error("Fetch Staff Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStaff();
    }, []);

    // Add staff to backend
    const handleAddStaff = async (staffData) => {
        try {
            const newStaff = await staffApi.addStaff(staffData);
            setStaffMembers([...staffMembers, newStaff]);
        } catch (err) {
            console.error("Add Staff Error:", err);
            setError("Failed to add staff");
        }
    };

    return (
        <div>
            <StaffForm onAddStaff={handleAddStaff}/>

            {/* Staff List */}
            <div className="container mt-4">
                <h3>Staff Members</h3>

                {loading && <p>Loading staff...</p>}
                {error && <p className="text-danger">{error}</p>}

                {!loading && staffMembers.length === 0 ? (
                    <p className="text-muted">No staff members added yet</p>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-striped table-hover">
                            <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Department</th>
                                <th>Position</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            {staffMembers.map((staff, index) => (
                                <tr key={index}>
                                    <td>{staff.staff_id}</td>
                                    <td>{staff.name}</td>
                                    <td>{staff.department}</td>
                                    <td>{staff.position}</td>
                                    <td>{staff.email}</td>
                                    <td>{staff.phone}</td>
                                    <td>
                                            <span
                                                className={`badge ${
                                                    staff.status === "active"
                                                        ? "bg-success"
                                                        : staff.status === "inactive"
                                                            ? "bg-secondary"
                                                            : staff.status === "on_leave"
                                                                ? "bg-warning"
                                                                : "bg-danger"
                                                }`}
                                            >
                                                {staff.status}
                                            </span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default StaffManagementPage;
