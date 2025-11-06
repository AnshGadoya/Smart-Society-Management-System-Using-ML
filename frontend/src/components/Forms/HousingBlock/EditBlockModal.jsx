import React from "react";
import EditBlockForm from "./EditBlockForm";

function EditBlockModal({block, onSave, onCancel}) {
    return (
        <div className="modal fade" id="editBlockModal" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Edit Block</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        {block && (
                            <EditBlockForm
                                block={block}
                                onSave={(data) => {
                                    onSave(data);
                                    // close modal manually
                                    const modalEl = document.getElementById("editBlockModal");
                                    const modal = window.bootstrap.Modal.getInstance(modalEl);
                                    modal.hide();
                                }}
                                onCancel={onCancel}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditBlockModal;
