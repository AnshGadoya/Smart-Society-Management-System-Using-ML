import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Calendar3,
    Person,
    People,
    Paperclip,
    FileText
} from "react-bootstrap-icons";

export default function CreateNoticeModal({ isOpen, onClose, onAddNotice }) {
    const today = new Date().toISOString().split("T")[0];
    const defaultValid = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    const [formData, setFormData] = useState({
        title: "",
        body: "",
        category: "general",
        issue_date: today,
        valid_until: defaultValid,
        issuer_name: "Management Office",
        target_audience: "all",
        attachments: "",
        ack_required: "no"
    });

    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const categories = [
        { id: "general", label: "General" },
        { id: "maintenance", label: "Maintenance" },
        { id: "event", label: "Meeting / Event" },
        { id: "security", label: "Security" },
        { id: "policy", label: "Policy / Rules" },
        { id: "emergency", label: "Urgent" }
    ];

    const audiences = [
        { value: "all", label: "All Residents" },
        { value: "owners", label: "Flat Owners Only" },
        { value: "tenants", label: "Tenants Only" },
        { value: "staff", label: "Staff & Security" }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = {};
        if (!formData.title.trim()) errs.title = "Notice Title is required";
        if (!formData.body.trim()) errs.body = "Notice message description is required";
        if (!formData.issuer_name.trim()) errs.issuer_name = "Issuer is required";

        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }

        setSubmitting(true);
        try {
            const noticeId = `NOTICE-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            const noticePayload = {
                notice_id: noticeId,
                ...formData,
                attachments: formData.attachments ? formData.attachments.split(",").map(a => a.trim()) : []
            };

            await onAddNotice(noticePayload);
            onClose();
        } catch (error) {
            console.error("Submit Notice Error:", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="create-notice-overlay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    onClick={(e) => {
                        if (e.target === e.currentTarget) onClose();
                    }}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        zIndex: 1050,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "20px",
                        background: "rgba(15, 23, 42, 0.55)"
                    }}
                >
                    {/* Modal Window */}
                    <motion.div
                        key="create-notice-dialog"
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: 10 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            position: "relative",
                            width: "100%",
                            maxWidth: "640px",
                            maxHeight: "90vh",
                            background: "#ffffff",
                            borderRadius: "12px",
                            boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.25)",
                            border: "1px solid #e2e8f0",
                            overflow: "hidden",
                            display: "flex",
                            flexDirection: "column",
                            zIndex: 1
                        }}
                    >
                        {/* Clean Corporate Header */}
                        <div
                            style={{
                                padding: "18px 24px",
                                borderBottom: "1px solid #e2e8f0",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                background: "#ffffff"
                            }}
                        >
                            <div>
                                <h5 className="fw-bold mb-0 text-dark" style={{ letterSpacing: "-0.01em", fontSize: "1.1rem" }}>
                                    Create Society Notice
                                </h5>
                                <p className="mb-0 text-muted small" style={{ fontSize: "0.82rem" }}>
                                    Official communication to society residents and committee members
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                style={{
                                    background: "#f1f5f9",
                                    border: "1px solid #e2e8f0",
                                    color: "#64748b",
                                    width: "30px",
                                    height: "30px",
                                    borderRadius: "8px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer"
                                }}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Form Body */}
                        <form onSubmit={handleSubmit} style={{ overflowY: "auto", padding: "20px 24px", flex: 1 }}>
                            {/* Title */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold text-dark small mb-1">
                                    Notice Title <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Overhead Water Tank Cleaning Schedule"
                                    className={`form-control ${errors.title ? "is-invalid" : ""}`}
                                    style={{ padding: "9px 12px", borderRadius: "8px", borderColor: "#cbd5e1", fontSize: "0.9rem" }}
                                />
                                {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                            </div>

                            {/* Category - Clean Understated Pills */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold text-dark small mb-1 d-block">
                                    Notice Type
                                </label>
                                <div className="d-flex flex-wrap gap-2">
                                    {categories.map(cat => {
                                        const isSelected = formData.category === cat.id;
                                        return (
                                            <button
                                                key={cat.id}
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, category: cat.id }))}
                                                style={{
                                                    background: isSelected ? "#2563eb" : "#f8fafc",
                                                    color: isSelected ? "#ffffff" : "#475569",
                                                    border: `1px solid ${isSelected ? "#2563eb" : "#e2e8f0"}`,
                                                    padding: "5px 12px",
                                                    borderRadius: "6px",
                                                    fontSize: "0.8rem",
                                                    fontWeight: isSelected ? "600" : "500",
                                                    cursor: "pointer",
                                                    transition: "all 0.15s ease"
                                                }}
                                            >
                                                {cat.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Notice Body */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold text-dark small mb-1">
                                    Notice Details <span className="text-danger">*</span>
                                </label>
                                <textarea
                                    name="body"
                                    value={formData.body}
                                    onChange={handleChange}
                                    rows="4"
                                    placeholder="Provide clear details, timings, action items, or instructions..."
                                    className={`form-control ${errors.body ? "is-invalid" : ""}`}
                                    style={{ padding: "10px 12px", borderRadius: "8px", borderColor: "#cbd5e1", fontSize: "0.88rem", lineHeight: 1.5 }}
                                />
                                {errors.body && <div className="invalid-feedback">{errors.body}</div>}
                            </div>

                            {/* Target Audience & Issuer */}
                            <div className="row g-3 mb-3">
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold text-dark small mb-1">
                                        Target Audience
                                    </label>
                                    <select
                                        name="target_audience"
                                        value={formData.target_audience}
                                        onChange={handleChange}
                                        className="form-select"
                                        style={{ padding: "8px 12px", borderRadius: "8px", borderColor: "#cbd5e1", fontSize: "0.88rem" }}
                                    >
                                        {audiences.map(aud => (
                                            <option key={aud.value} value={aud.value}>{aud.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-semibold text-dark small mb-1">
                                        Issued By <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="issuer_name"
                                        value={formData.issuer_name}
                                        onChange={handleChange}
                                        placeholder="e.g. Management Committee"
                                        className={`form-control ${errors.issuer_name ? "is-invalid" : ""}`}
                                        style={{ padding: "8px 12px", borderRadius: "8px", borderColor: "#cbd5e1", fontSize: "0.88rem" }}
                                    />
                                    {errors.issuer_name && <div className="invalid-feedback">{errors.issuer_name}</div>}
                                </div>
                            </div>

                            {/* Dates */}
                            <div className="row g-3 mb-3">
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold text-dark small mb-1">
                                        Effective Date
                                    </label>
                                    <input
                                        type="date"
                                        name="issue_date"
                                        value={formData.issue_date}
                                        onChange={handleChange}
                                        className="form-control"
                                        style={{ padding: "8px 12px", borderRadius: "8px", borderColor: "#cbd5e1", fontSize: "0.88rem" }}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-semibold text-dark small mb-1">
                                        Valid Until
                                    </label>
                                    <input
                                        type="date"
                                        name="valid_until"
                                        value={formData.valid_until}
                                        onChange={handleChange}
                                        className="form-control"
                                        style={{ padding: "8px 12px", borderRadius: "8px", borderColor: "#cbd5e1", fontSize: "0.88rem" }}
                                    />
                                </div>
                            </div>

                            {/* Attachments */}
                            <div className="mb-2">
                                <label className="form-label fw-semibold text-dark small mb-1">
                                    Reference Documents / Attachments (Optional)
                                </label>
                                <input
                                    type="text"
                                    name="attachments"
                                    value={formData.attachments}
                                    onChange={handleChange}
                                    placeholder="e.g. Meeting_Agenda.pdf"
                                    className="form-control"
                                    style={{ padding: "8px 12px", borderRadius: "8px", borderColor: "#cbd5e1", fontSize: "0.88rem" }}
                                />
                            </div>
                        </form>

                        {/* Footer */}
                        <div
                            style={{
                                padding: "14px 24px",
                                background: "#f8fafc",
                                borderTop: "1px solid #e2e8f0",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "flex-end",
                                gap: "10px"
                            }}
                        >
                            <button
                                type="button"
                                onClick={onClose}
                                className="btn btn-sm btn-outline-secondary"
                                style={{ borderRadius: "8px", fontWeight: "500", padding: "7px 16px" }}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="btn btn-sm btn-primary"
                                style={{
                                    borderRadius: "8px",
                                    fontWeight: "600",
                                    padding: "7px 20px",
                                    background: "#2563eb",
                                    borderColor: "#2563eb"
                                }}
                            >
                                {submitting ? "Publishing..." : "Publish Notice"}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
