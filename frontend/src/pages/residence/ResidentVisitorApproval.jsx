import React, { useEffect, useState } from "react";
import { visitorsApi } from "../../services/api";

const ResidentVisitorApproval = ({ memberId }) => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPendingVisitors = async () => {
    try {
      setLoading(true);
      console.log("Fetched visitors:", memberId);
      const data = await visitorsApi.getPendingVisitors(memberId);
      console.log("Fetched visitors:", data);
      setVisitors(data);
    } catch (error) {
      console.error("Failed to fetch visitors", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingVisitors();
  }, []);

  const handleAction = async (id, action) => {
    try {
      if (action === "approve") {
        await visitorsApi.approveVisitor(id);
      } else {
        await visitorsApi.declineVisitor(id);
      }
      fetchPendingVisitors();
    } catch (error) {
      console.error("Action failed", error);
    }
  };

  return (
    <div className="container py-5">
      <div className="card shadow-lg border-0">
        <div className="card-header bg-primary text-white text-center py-3 rounded-top">
          <h3 className="mb-0">
            <i className="fa-solid fa-user-check me-2"></i> Pending Visitor Requests
          </h3>
        </div>

        <div className="card-body bg-light">
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : visitors.length === 0 ? (
            <div className="alert alert-info text-center" role="alert">
              No pending visitor requests 😊
            </div>
          ) : (
            <div className="list-group">
              {[...visitors].reverse().map((v) => (
                <div
                  key={v.id}
                  className="list-group-item list-group-item-action d-flex justify-content-between align-items-center border-start border-4 border-primary shadow-sm mb-2 rounded-3"
                >
                  <div>
                    <h5 className="mb-1 fw-bold text-dark">
                      {v.name}{" "}
                      <span className="text-muted small">({v.flatNo})</span>
                    </h5>
                    <p className="mb-1 text-secondary">
                      <i className="fa-solid fa-clipboard me-1"></i> {v.purpose}
                    </p>
                  </div>
                  <div className="btn-group">
                    <button
                      onClick={() => handleAction(v.id, "approve")}
                      className="btn btn-success btn-sm px-3 me-2"
                    >
                      <i className="fa-solid fa-check me-1"></i> Approve
                    </button>
                    <button
                      onClick={() => handleAction(v.id, "decline")}
                      className="btn btn-danger btn-sm px-3"
                    >
                      <i className="fa-solid fa-times me-1"></i> Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResidentVisitorApproval;
