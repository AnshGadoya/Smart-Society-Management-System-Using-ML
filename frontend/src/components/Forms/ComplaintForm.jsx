import React, {useState} from "react";
import {complaintApi} from "../../services/api";

export default function ComplaintForm() {
    const [form, setForm] = useState({
        title: "",
        description: "",
        resident_name: "",
        flat_no: "",
        attachment_url: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [lastResult, setLastResult] = useState(null);

    // Handle input changes
    const onChange = (e) => {
        const {name, value} = e.target;
        setForm((f) => ({...f, [name]: value}));
    };

    // Submit logic (with description classification)
    const onSubmit = async (e) => {
        e.preventDefault();

        if (!form.description.trim()) {
            alert("Please enter a complaint description");
            return;
        }
        console.log("form", form);
        setSubmitting(true);
        try {
            // Call your backend (this should run ML classification on description)
            const response = await complaintApi.addComplaint(form);

            if (response?.data) {
                setLastResult(response.data); // expecting {category, confidence, status}
                // alert(response.data.status || "Complaint submitted");
            }

            // Reset form
            setTimeout(() => {
                setLastResult(null);
                setForm({
                    title: "",
                    description: "",
                    resident_name: "",
                    flat_no: "",
                    attachment_url: "",
                });
            }, 5000);
        } catch (err) {
            alert("Failed to submit: " + err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{maxWidth: 720, margin: "20px auto"}}>
            <div
                style={{
                    background: "#fff",
                    borderRadius: 16,
                    padding: 24,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                }}
            >
                <h2 style={{marginBottom: 12}}>Add Complaint</h2>
                <p style={{marginTop: 0, color: "#666"}}>
                    Describe your issue clearly. Our system will auto-route it to the right team.
                </p>

                <form onSubmit={onSubmit}>
                    <div style={{display: "grid", gap: 12}}>
                        {/* Title */}
                        <div>
                            <label>Title</label>
                            <input
                                name="title"
                                value={form.title}
                                onChange={onChange}
                                placeholder="e.g., Tap leakage in bathroom"
                                required
                                style={{
                                    width: "100%",
                                    padding: 10,
                                    borderRadius: 8,
                                    border: "1px solid #e2e2e2",
                                }}
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label>Description</label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={onChange}
                                placeholder="Please describe your complaint in detail..."
                                required
                                rows={4}
                                style={{
                                    width: "100%",
                                    padding: 10,
                                    borderRadius: 8,
                                    border: "1px solid #e2e2e2",
                                }}
                            />
                            <div style={{fontSize: 12, color: "#666", marginTop: 4}}>
                                Be specific about the issue, including location and time if relevant.
                            </div>
                        </div>

                        {/* Resident Info */}
                        <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12}}>
                            <div>
                                <label>Resident Name</label>
                                <input
                                    name="resident_name"
                                    value={form.resident_name}
                                    onChange={onChange}
                                    placeholder="Your name"
                                    style={{
                                        width: "100%",
                                        padding: 10,
                                        borderRadius: 8,
                                        border: "1px solid #e2e2e2",
                                    }}
                                />
                            </div>
                            <div>
                                <label>Flat No</label>
                                <input
                                    name="flat_no"
                                    value={form.flat_no}
                                    onChange={onChange}
                                    placeholder="e.g., B-504"
                                    style={{
                                        width: "100%",
                                        padding: 10,
                                        borderRadius: 8,
                                        border: "1px solid #e2e2e2",
                                    }}
                                />
                            </div>
                        </div>

                        {/* Attachment */}
                        <div>
                            <label>Attachment URL (optional)</label>
                            <input
                                name="attachment_url"
                                value={form.attachment_url}
                                onChange={onChange}
                                placeholder="https://image-of-issue"
                                style={{
                                    width: "100%",
                                    padding: 10,
                                    borderRadius: 8,
                                    border: "1px solid #e2e2e2",
                                }}
                            />
                        </div>

                        {/* Submit */}
                        <div style={{display: "flex", gap: 12, alignItems: "center"}}>
                            <button
                                disabled={submitting}
                                type="submit"
                                style={{
                                    padding: "10px 16px",
                                    background: "#2563eb",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: 10,
                                    cursor: "pointer",
                                }}
                            >
                                {submitting ? "Submitting..." : "Submit Complaint"}
                            </button>
                            <span style={{color: "#666", fontSize: 13}}>
                You’ll see the predicted category after submission.
              </span>
                        </div>
                    </div>
                </form>

                {/* ML Prediction */}
                {lastResult?.category && (
                    <div
                        style={{
                            marginTop: 16,
                            padding: 12,
                            borderRadius: 10,
                            background: "#f8fafc",
                            border: "1px solid #e6ebf2",
                        }}
                    >
                        <b>Predicted Category:</b> {lastResult.category}{" "}
                        <span style={{color: "#6b7280"}}>
              {lastResult.confidence &&
                  `(confidence ${(lastResult.confidence * 100).toFixed(1)}%)`}
            </span>
                    </div>
                )}
            </div>
        </div>
    );
}
