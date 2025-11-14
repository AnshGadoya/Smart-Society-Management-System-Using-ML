import React, {useState} from "react";
import {visitorsApi} from "../../services/api";


function ValidateCode() {
  const [inputCode, setInputCode] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setInputCode(e.target.value);
    setResult(null);
  };

  const handleValidate = async (e) => {
    e.preventDefault();
    if (!inputCode.trim()) return alert("Please enter a code");
    setLoading(true);
    setResult(null);

    try {
      const response = await visitorsApi.verifyVisitor(inputCode);
      setResult(response);
    } catch (err) {
      setResult({ valid: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center mt-5"
      style={{
        minHeight: "70vh",
        background: "#fff",
      }}
    >
        <div
            className="card border-0 shadow-lg p-4 text-center"
            style={{
                width: "420px",
                background:
                    "linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)", // gradient INSIDE card
                borderRadius: "20px",
                color: "#fff",
                transition: "transform 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
        <h3 className="fw-bold mb-4">🔐 Validate Visitor Code</h3>

        <form onSubmit={handleValidate}>
          <div className="form-group mb-3">
            <input
              type="number"
              className="form-control text-center fs-5 py-2 rounded-pill"
              value={inputCode}
              onChange={handleChange}
              placeholder="Enter 6-digit code"
              required
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                color: "#fff",
                border: "none",
              }}
            />
          </div>
          <button
            type="submit"
            className="btn btn-light w-100 fw-bold rounded-pill"
            style={{
              background: "linear-gradient(135deg, #667eea, #764ba2)",

              color: "#fff",
              border: "none",
              letterSpacing: "1px",
              transition: "0.3s",
            }}
          >
            {loading ? "Validating..." : "Validate Code"}
          </button>
        </form>

        {result && (
          <div
            className="mt-4 p-3 rounded"
            style={{
              backgroundColor: result.valid
                ? "rgba(40, 167, 69, 0.2)"
                : "rgba(220, 53, 69, 0.2)",
              color: "#fff",
              transition: "all 0.5s ease",
            }}
          >
            {result.valid ? (
              <>
                <h5 className="mb-2">✅ Code Verified</h5>
                <hr style={{ borderColor: "rgba(255,255,255,0.3)" }} />
                <p><strong>Name:</strong> {result.visitor.name}</p>
                <p><strong>Flat No:</strong> {result.visitor.flatNo}</p>
                <p><strong>Purpose:</strong> {result.visitor.purpose}</p>
                <p><strong>Date:</strong> {result.visitor.visitDate}</p>
              </>
            ) : (
              <h5>❌ Invalid Code! Please try again.</h5>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ValidateCode;
