import React, {useState, useEffect} from "react";
import {utilityApi, blockApi} from "../../services/api";
import EditUtilityUsageForm from "../../components/Forms/UtilityUsage/EditUtilityUsageForm";
import AddUtilityUsageForm from "../../components/Forms/UtilityUsage/AddUtilityUsageForm";

function UtilityUsageView() {
    const [records, setRecords] = useState([]);
    const [blocks, setBlocks] = useState([]);
    const [selectedRecord, setSelectedRecord] = useState(null);

    const fetchRecords = async () => {
        try {
            const res = await utilityApi.getUtilities();
            setRecords(res || []);
        } catch (err) {
            console.error("Failed to fetch utility records:", err);
        }
    };

    const fetchBlocks = async () => {
        try {
            const res = await blockApi.getBlocks();
            setBlocks(res || []);
        } catch (err) {
            console.error("Failed to fetch blocks in utilityView:", err);
        }
    };

    useEffect(() => {
        fetchRecords();
        fetchBlocks();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure to delete this record?")) return;
        try {
            await utilityApi.deleteUtility(id);
            fetchRecords();
        } catch (err) {
            console.error(err);
            alert("Failed to delete record");
        }
    };

    const handleSave = async (updatedRecord) => {
        try {
            await utilityApi.updateUtility(updatedRecord.id, updatedRecord);
            setSelectedRecord(null);
            fetchRecords();
        } catch (err) {
            console.error(err);
            alert("Failed to update record");
        }
    };

    return (<div className="container mt-4">
            <h3>Utility Usage Management</h3>

            {/* Add Form */}
            <AddUtilityUsageForm onSuccess={fetchRecords}/>

            {/* Table */}
            <div className="table-responsive mt-4 bg-white rounded shadow p-3">
                <table className="table table-striped table-hover align-middle">
                    <thead className="table-light">
                    <tr>
                        <th>Date</th>
                        <th>Block</th>
                        <th>Utility Type</th>
                        <th>Value</th>
                        <th>Unit</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {records.length === 0 ? (<tr>
                            <td colSpan="7" className="text-center text-muted">
                                No records found
                            </td>
                        </tr>) : (records.map((r) => (<tr key={r.id}>
                                <td>{r.date}</td>
                                <td>{blocks.find(b => b.id === r.block_id)?.block_name || r.block_id}</td>
                                <td>{r.utility_type}</td>
                                <td>{r.value}</td>
                                <td>{r.unit}</td>
                                <td>{r.description}</td>
                                <td>
                                    <button className="btn btn-sm btn-primary me-2"
                                            onClick={() => setSelectedRecord(r)}>
                                        Edit
                                    </button>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(r.id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>)))}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {selectedRecord && (<EditUtilityUsageForm
                    item={selectedRecord}
                    blocks={blocks}
                    onSave={handleSave}
                    onCancel={() => setSelectedRecord(null)}
                />)}
        </div>);
}

export default UtilityUsageView;
