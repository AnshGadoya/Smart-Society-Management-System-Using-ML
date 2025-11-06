import React, { useState } from "react";
import EditHousingBlockForm from "../Forms/HousingBlock/editHousingBlockForm";

function HousingTable({ columns = [], data = [], onUpdate, blocks = [] }) {
    const [selectedRow, setSelectedRow] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const onEdit = (row) => {
        setSelectedRow(row);
        setIsModalOpen(true);
    };

    const onDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this block?")) {
            onUpdate({ id }, "delete");
        }
    };

    const handleSave = (updatedRow) => {
        onUpdate(updatedRow, "edit");
        setIsModalOpen(false);
        setSelectedRow(null);
    };

    const handleClose = () => {
        setIsModalOpen(false);
        setSelectedRow(null);
    };

    return (
        <>
            <div className="table-responsive bg-white rounded shadow p-3">
                <table className="table table-striped table-hover align-middle">
                    <thead className="table-light">
                    <tr>
                        {columns.map((col, idx) => (
                            <th key={idx} className="text-uppercase small fw-bold">
                                {col.header}
                            </th>
                        ))}
                        <th className="text-uppercase small fw-bold">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.length === 0 && (
                        <tr>
                            <td colSpan={columns.length + 1} className="text-center text-muted">
                                No records found
                            </td>
                        </tr>
                    )}
                    {data.map((row, rIdx) => (
                        <tr key={rIdx}>
                            {columns.map((col, cIdx) => (
                                <td key={cIdx}>{row[col.accessor]}</td>
                            ))}
                            <td>
                                <button className="btn btn-sm btn-primary me-2" onClick={() => onEdit(row)}>
                                    Edit
                                </button>
                                <button className="btn btn-sm btn-danger" onClick={() => onDelete(row.id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {isModalOpen && selectedRow && (
                <EditHousingBlockForm
                    item={selectedRow}
                    blocks={blocks}
                    columns={columns}
                    onSave={handleSave}
                    onCancel={handleClose}
                />
            )}
        </>
    );
}

export default HousingTable;
