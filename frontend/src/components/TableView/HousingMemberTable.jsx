// src/components/TableView/HousingMemberTable.jsx
import React from "react";

function HousingMemberTable({ members, onUpdate, onDelete }) {
    return (
        <div className="table-responsive mt-4">
            <table className="table table-striped">
                <thead className="table-dark">
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Block</th>
                    <th>Unit</th>
                    <th>Relationship</th>
                    <th>Status</th>
                    <th>Primary</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {members.length === 0 ? (
                    <tr>
                        <td colSpan="8" className="text-center">No members found</td>
                    </tr>
                ) : (
                    members.map(member => (
                        <tr key={member.id}>
                            <td>{member.member_id}</td>
                            <td>{member.name}</td>
                            <td>{member.block_name}</td>
                            <td>{member.unit_number}</td>
                            <td>{member.relationship}</td>
                            <td>{member.status}</td>
                            <td>{member.is_primary ? "Yes" : "No"}</td>
                            <td>
                                <button className="btn btn-sm btn-danger" onClick={() => onDelete(member.id)}>Delete</button>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
}

export default HousingMemberTable;
