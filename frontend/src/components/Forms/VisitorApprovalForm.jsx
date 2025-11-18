import React, { useEffect, useState } from "react";
import { visitorsApi } from "../../services/api";
import "bootstrap/dist/css/bootstrap.min.css";

const GuardVisitorForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    flatNo: "",
    purpose: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [visitorList, setVisitorList] = useState([]);

  // ✅ Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Fetch all visitors once
  const fetchVisitors = async () => {
    try {
      const data = await visitorsApi.getVisitors();
      setVisitorList(data);
    } catch (error) {
      console.error("Failed to fetch visitor list", error);
    }
  };

  useEffect(() => {
    fetchVisitors(); // load data once on mount
  }, []);

  // ✅ Submit visitor form
  const handleSubmit = async () => {
    try {
      setLoading(true);
      setMessage("");
      await visitorsApi.requestVisitor(formData);
      setMessage("✅ Request sent to resident for approval!");
      await fetchVisitors(); // refresh list only after new entry
      setFormData({
        name: "",
        phone: "",
        email: "",
        flatNo: "",
        purpose: "",
      });
    } catch (error) {
      setMessage("❌ Failed to send visitor request.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Bootstrap badge classes
  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "badge bg-success";
      case "declined":
        return "badge bg-danger";
      default:
        return "badge bg-warning text-dark";
    }
  };

  return (
    <div className="container py-5 bg-light min-vh-100">
      {/* Visitor Form */}
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow border-0">
            <div className="card-body">
              <h3 className="card-title text-center text-primary mb-4">
                🧾 Random Visitor Entry
              </h3>

              {/* Form Fields */}
              <div className="row g-3">
                {["name", "phone", "email", "flatNo", "purpose"].map((field) => (
                  <div className="col-12" key={field}>
                    <label className="form-label text-capitalize">{field}</label>
                    <input
                      type="text"
                      className="form-control"
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      placeholder={`Enter ${field}`}
                    />
                  </div>
                ))}
              </div>

              <button
                className="btn btn-primary w-100 mt-4"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Request"}
              </button>

              {message && (
                <div className="alert alert-info text-center mt-3" role="alert">
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Visitor List */}
      <div className="row justify-content-center mt-5">
        <div className="col-md-10 col-lg-8">
          <div className="card shadow border-0">
            <div className="card-body">
              <h4 className="text-center text-primary mb-4">
                Visitor Request Status
              </h4>

              {visitorList.length === 0 ? (
                <p className="text-center text-muted">No visitors yet</p>
              ) : (
                <div className="list-group">
                  {[...visitorList].reverse().map((v) => (
                    <div
                      key={v.id}
                      className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <h6 className="mb-1">
                          {v.name}{" "}
                          <span className="text-muted">({v.flatNo})</span>
                        </h6>
                        <small className="text-muted">{v.purpose}</small>
                      </div>
                      <span className={getStatusClass(v.status)}>
                        {v.status?.toLowerCase() === "approved"
                          ? "✅ Approved"
                          : v.status?.toLowerCase() === "declined"
                          ? "❌ Declined"
                          : "⏳ Pending"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuardVisitorForm;
