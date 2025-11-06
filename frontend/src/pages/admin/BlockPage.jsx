import React, {useEffect, useState} from "react";
import {blockApi} from "../../services/api";
import AddBlockForm from "../../components/Forms/HousingBlock/AddBlockForm";
import PageHeader from "../../layout/PageHeader";
import EditBlockModal from "../../components/Forms/HousingBlock/EditBlockModal";


function HousingBlockPage() {
    const [blocks, setBlocks] = useState([]);
    const [selectedBlock, setSelectedBlock] = useState(null);

    const fetchBlocks = async () => {
        try {
            const response = await blockApi.getBlocks();
            setBlocks(response || []);
        } catch (err) {
            console.error("Error fetching blocks", err);
        }
    };

    useEffect(() => {
        fetchBlocks();
    }, []);

    const handleDelete = async (blockId) => {
        if (!window.confirm("Are you sure you want to delete this block?")) return;
        try {
            const response = await blockApi.deleteBlock(blockId);
            console.log(response);
            fetchBlocks();
        } catch (err) {
            console.error("Error deleting block", err);
        }
    };

    return (
        <div className="container mt-4">
            <PageHeader PageTitle={"Housing Block Management"}/>


            {/* Add Block Form */}
            <AddBlockForm onSuccess={fetchBlocks}/>

            {/* Blocks Table */}
            <div className="card mt-4 shadow-sm">
                <div className="card-body">
                    <h5 className="mb-3">All Blocks</h5>
                    <table className="table table-striped table-hover">
                        <thead>
                        <tr>
                            <th>Block ID</th>
                            <th>Name</th>
                            <th>Flats Count</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {blocks.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center">
                                    No blocks found.
                                </td>
                            </tr>
                        ) : (
                            blocks.map((block) => (
                                <tr key={block.id}>
                                    <td>{block.id}</td>
                                    <td>{block.block_name}</td>
                                    <td>{block.flat_count}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-outline-primary me-2"
                                            data-bs-toggle="modal"
                                            data-bs-target="#editBlockModal"
                                            onClick={() => setSelectedBlock(block)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => handleDelete(block.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Block Modal */}
            <EditBlockModal
                block={selectedBlock}
                onSave={async (data) => {
                    try {
                        await blockApi.updateBlock(selectedBlock.id, data); // use fresh data
                        fetchBlocks(); // refresh table
                        setSelectedBlock(null); // close modal/reset
                    } catch (err) {
                        console.error("Error updating block", err);
                    }
                }}
                onCancel={() => setSelectedBlock(null)}
            />
        </div>
    );
}

export default HousingBlockPage;
