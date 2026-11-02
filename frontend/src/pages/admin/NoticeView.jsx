import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, parseISO } from "date-fns";
import {
    Plus,
    Search,
    Calendar,
    Paperclip,
    Trash,
    Grid,
    ListUl,
    Table,
    ArrowRepeat,
    X,
    FileText,
    Clock,
    Person,
    MegaphoneFill,
    Eye
} from "react-bootstrap-icons";
import { noticeApi } from "../../services/api";
import CreateNoticeModal from "../../components/Notice/CreateNoticeModal";

function NoticeView() {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    // Filters and search
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [viewMode, setViewMode] = useState("list"); // Default is 'list' as requested
    const [selectedNotice, setSelectedNotice] = useState(null); // for details modal
    const [alertMessage, setAlertMessage] = useState(null);

    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        setRefreshing(true);
        try {
            const data = await noticeApi.getNotices();
            setNotices(data || []);
        } catch (err) {
            console.error("Failed to fetch notices:", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleAddNotice = async (noticeData) => {
        try {
            await noticeApi.addNotice(noticeData);
            setAlertMessage({ type: "success", text: "Notice successfully published." });
            setTimeout(() => setAlertMessage(null), 3500);
            fetchNotices();
        } catch (err) {
            console.error("Failed to add notice:", err);
            setAlertMessage({ type: "danger", text: "Failed to publish notice. Please try again." });
            setTimeout(() => setAlertMessage(null), 3500);
        }
    };

    const handleDeleteNotice = async (noticeId, e) => {
        if (e) e.stopPropagation();
        if (!window.confirm("Are you sure you want to remove this notice?")) return;

        try {
            await noticeApi.deleteNotice(noticeId);
            setNotices(prev => prev.filter(n => n.id !== noticeId && n.notice_id !== noticeId));
            if (selectedNotice && (selectedNotice.id === noticeId || selectedNotice.notice_id === noticeId)) {
                setSelectedNotice(null);
            }
            setAlertMessage({ type: "success", text: "Notice removed." });
            setTimeout(() => setAlertMessage(null), 2500);
        } catch (err) {
            console.error("Delete notice error:", err);
            setNotices(prev => prev.filter(n => n.id !== noticeId && n.notice_id !== noticeId));
        }
    };

    const formatDateSafe = (dateStr) => {
        if (!dateStr) return "-";
        try {
            return format(parseISO(dateStr), "dd MMM yyyy");
        } catch (e) {
            return dateStr;
        }
    };

    const formatMonthDay = (dateStr) => {
        if (!dateStr) return { day: "--", month: "---" };
        try {
            const d = parseISO(dateStr);
            return {
                day: format(d, "dd"),
                month: format(d, "MMM").toUpperCase()
            };
        } catch (e) {
            return { day: "01", month: "NOV" };
        }
    };

    // Filter computation
    const filteredNotices = notices.filter(n => {
        const matchCategory = selectedCategory === "all" || (n.category || "").toLowerCase() === selectedCategory;
        const q = searchQuery.toLowerCase().trim();
        const matchSearch = !q ||
            (n.title && n.title.toLowerCase().includes(q)) ||
            (n.body && n.body.toLowerCase().includes(q)) ||
            (n.issuer_name && n.issuer_name.toLowerCase().includes(q));
        return matchCategory && matchSearch;
    });

    const categoriesList = [
        { id: "all", label: "All Notices" },
        { id: "maintenance", label: "Maintenance" },
        { id: "event", label: "Meetings & Events" },
        { id: "security", label: "Security" },
        { id: "policy", label: "Rules & Policy" },
        { id: "general", label: "General" }
    ];

    return (
        <div style={{ maxWidth: "1280px", margin: "0 auto", paddingBottom: "40px", textAlign: "left" }}>
            {/* 1. Header Banner with Primary Blue Theme */}
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 pb-3 border-bottom">
                <div>
                    <h3 className="fw-bold text-dark mb-1" style={{ letterSpacing: "-0.02em" }}>
                        Society Notice Board
                    </h3>
                    <p className="text-secondary small mb-0">
                        Official announcements, facility schedules, and administrative circulars
                    </p>
                </div>

                <div className="d-flex align-items-center gap-2">
                    <button
                        onClick={fetchNotices}
                        className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-2"
                        disabled={refreshing}
                        style={{ borderRadius: "8px", padding: "7px 14px", fontWeight: "500" }}
                    >
                        <ArrowRepeat size={14} className={refreshing ? "spin-animation" : ""} />
                        <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
                    </button>

                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="btn btn-sm btn-primary d-inline-flex align-items-center gap-1"
                        style={{
                            background: "#2563eb",
                            borderColor: "#2563eb",
                            borderRadius: "8px",
                            padding: "7px 18px",
                            fontWeight: "600",
                            boxShadow: "0 2px 6px rgba(37, 99, 235, 0.25)"
                        }}
                    >
                        <Plus size={18} />
                        <span>Create Notice</span>
                    </button>
                </div>
            </div>

            {/* Alert Message */}
            {alertMessage && (
                <div
                    className={`alert alert-${alertMessage.type} py-2 px-3 mb-3 small d-flex align-items-center justify-content-between`}
                    style={{ borderRadius: "8px" }}
                >
                    <span>{alertMessage.text}</span>
                    <button
                        type="button"
                        className="btn-close"
                        style={{ fontSize: "0.7rem" }}
                        onClick={() => setAlertMessage(null)}
                    />
                </div>
            )}

            {/* 2. Controls: Search, Filter Tabs, and View Mode Toggle */}
            <div
                className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 p-2 bg-white rounded-3 border"
                style={{ borderColor: "#e2e8f0" }}
            >
                {/* Search */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        background: "#f8fafc",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        border: "1px solid #e2e8f0",
                        width: "280px"
                    }}
                >
                    <Search size={14} color="#64748b" />
                    <input
                        type="text"
                        placeholder="Search notices..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            border: "none",
                            outline: "none",
                            background: "transparent",
                            fontSize: "0.85rem",
                            color: "#0f172a",
                            width: "100%"
                        }}
                    />
                    {searchQuery && (
                        <X
                            size={16}
                            color="#94a3b8"
                            style={{ cursor: "pointer" }}
                            onClick={() => setSearchQuery("")}
                        />
                    )}
                </div>

                {/* Categories with Brand Blue Selection */}
                <div className="d-flex flex-wrap align-items-center gap-1">
                    {categoriesList.map(cat => {
                        const isSelected = selectedCategory === cat.id;
                        return (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                style={{
                                    background: isSelected ? "#2563eb" : "transparent",
                                    color: isSelected ? "#ffffff" : "#475569",
                                    border: `1px solid ${isSelected ? "#2563eb" : "transparent"}`,
                                    borderRadius: "6px",
                                    padding: "5px 12px",
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

                {/* View Switch: List (default), Table, Grid */}
                <div className="d-flex align-items-center gap-1 border rounded p-1" style={{ background: "#f8fafc" }}>
                    <button
                        onClick={() => setViewMode("list")}
                        style={{
                            background: viewMode === "list" ? "#ffffff" : "transparent",
                            border: "none",
                            borderRadius: "4px",
                            padding: "4px 8px",
                            color: viewMode === "list" ? "#2563eb" : "#64748b",
                            boxShadow: viewMode === "list" ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
                            cursor: "pointer",
                            fontSize: "0.8rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            fontWeight: viewMode === "list" ? "600" : "500"
                        }}
                        title="List View (Recommended)"
                    >
                        <ListUl size={15} />
                        <span>List</span>
                    </button>
                    <button
                        onClick={() => setViewMode("table")}
                        style={{
                            background: viewMode === "table" ? "#ffffff" : "transparent",
                            border: "none",
                            borderRadius: "4px",
                            padding: "4px 8px",
                            color: viewMode === "table" ? "#2563eb" : "#64748b",
                            boxShadow: viewMode === "table" ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
                            cursor: "pointer",
                            fontSize: "0.8rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            fontWeight: viewMode === "table" ? "600" : "500"
                        }}
                        title="Table View"
                    >
                        <Table size={14} />
                        <span>Table</span>
                    </button>
                    <button
                        onClick={() => setViewMode("grid")}
                        style={{
                            background: viewMode === "grid" ? "#ffffff" : "transparent",
                            border: "none",
                            borderRadius: "4px",
                            padding: "4px 8px",
                            color: viewMode === "grid" ? "#2563eb" : "#64748b",
                            boxShadow: viewMode === "grid" ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
                            cursor: "pointer",
                            fontSize: "0.8rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            fontWeight: viewMode === "grid" ? "600" : "500"
                        }}
                        title="Grid View"
                    >
                        <Grid size={13} />
                        <span>Cards</span>
                    </button>
                </div>
            </div>

            {/* 3. Main Content: List View (Default) */}
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary spinner-border-sm" role="status"></div>
                    <p className="text-muted small mt-2">Loading society notices...</p>
                </div>
            ) : filteredNotices.length === 0 ? (
                <div className="text-center py-5 bg-white rounded-3 border" style={{ borderColor: "#e2e8f0" }}>
                    <FileText size={38} color="#94a3b8" className="mb-2" />
                    <h6 className="fw-bold text-dark mb-1">No Notices Found</h6>
                    <p className="text-muted small mb-3">There are no notices matching your search or category filter.</p>
                    <button
                        onClick={() => setIsCreateOpen(true)}
                        className="btn btn-sm btn-primary"
                        style={{ borderRadius: "6px", background: "#2563eb", borderColor: "#2563eb" }}
                    >
                        Create First Notice
                    </button>
                </div>
            ) : viewMode === "list" ? (
                /* === EXECUTIVE PROFESSIONAL LIST VIEW === */
                <div className="d-flex flex-column gap-3">
                    {filteredNotices.map((notice, idx) => {
                        const { day, month } = formatMonthDay(notice.issue_date);
                        return (
                            <div
                                key={notice.id || notice.notice_id || idx}
                                onClick={() => setSelectedNotice(notice)}
                                className="bg-white p-3 p-md-4 rounded-3 border d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3 text-start"
                                style={{
                                    borderColor: "#e2e8f0",
                                    cursor: "pointer",
                                    textAlign: "left",
                                    transition: "all 0.2s ease"
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = "#93c5fd";
                                    e.currentTarget.style.boxShadow = "0 4px 14px rgba(37, 99, 235, 0.06)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = "#e2e8f0";
                                    e.currentTarget.style.boxShadow = "none";
                                }}
                            >
                                {/* Left Content Group */}
                                <div className="d-flex align-items-start gap-3" style={{ flex: 1, minWidth: 0 }}>
                                    {/* Date Badge */}
                                    <div
                                        style={{
                                            width: "52px",
                                            minWidth: "52px",
                                            height: "56px",
                                            borderRadius: "8px",
                                            background: "#eff6ff",
                                            border: "1px solid #bfdbfe",
                                            color: "#1d4ed8",
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            lineHeight: 1.1
                                        }}
                                    >
                                        <span style={{ fontSize: "0.68rem", fontWeight: "700", letterSpacing: "0.05em" }}>{month}</span>
                                        <span style={{ fontSize: "1.25rem", fontWeight: "800" }}>{day}</span>
                                    </div>

                                    {/* Notice Details */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        {/* Top Badges */}
                                        <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                                            <span
                                                style={{
                                                    fontSize: "0.72rem",
                                                    fontWeight: "600",
                                                    color: "#1d4ed8",
                                                    background: "#eff6ff",
                                                    border: "1px solid #dbeafe",
                                                    padding: "2px 8px",
                                                    borderRadius: "4px",
                                                    textTransform: "uppercase",
                                                    letterSpacing: "0.03em"
                                                }}
                                            >
                                                {notice.category || "General"}
                                            </span>

                                            <span
                                                style={{
                                                    fontSize: "0.72rem",
                                                    color: "#475569",
                                                    background: "#f8fafc",
                                                    border: "1px solid #e2e8f0",
                                                    padding: "2px 8px",
                                                    borderRadius: "4px"
                                                }}
                                            >
                                                {notice.target_audience === "owners" ? "Owners Only" : notice.target_audience === "tenants" ? "Tenants Only" : "All Residents"}
                                            </span>

                                            <span className="text-secondary small d-none d-sm-inline" style={{ fontSize: "0.74rem" }}>
                                                • Issued by <strong style={{ color: "#334155" }}>{notice.issuer_name || "Management"}</strong>
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h6 className="fw-bold mb-1 text-dark text-truncate" style={{ fontSize: "1rem" }}>
                                            {notice.title}
                                        </h6>

                                        {/* Snippet */}
                                        <p className="text-secondary small mb-2 text-truncate" style={{ maxWidth: "800px", fontSize: "0.84rem" }}>
                                            {notice.body}
                                        </p>

                                        {/* Bottom Metadata */}
                                        <div className="d-flex flex-wrap align-items-center gap-3 text-muted" style={{ fontSize: "0.74rem" }}>
                                            <div className="d-flex align-items-center gap-1">
                                                <Calendar size={12} color="#2563eb" />
                                                <span>Issued: {formatDateSafe(notice.issue_date)}</span>
                                            </div>
                                            <div className="d-flex align-items-center gap-1">
                                                <Clock size={12} color="#64748b" />
                                                <span>Valid until: {formatDateSafe(notice.valid_until)}</span>
                                            </div>
                                            {notice.attachments && (
                                                <div className="d-flex align-items-center gap-1 text-primary">
                                                    <Paperclip size={12} />
                                                    <span>Attachment available</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Actions */}
                                <div className="d-flex align-items-center gap-2 align-self-end align-self-md-center" style={{ flexShrink: 0 }}>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedNotice(notice);
                                        }}
                                        className="btn btn-sm d-inline-flex align-items-center gap-1"
                                        style={{
                                            background: "#eff6ff",
                                            color: "#1d4ed8",
                                            border: "1px solid #bfdbfe",
                                            borderRadius: "6px",
                                            padding: "6px 14px",
                                            fontSize: "0.8rem",
                                            fontWeight: "600"
                                        }}
                                    >
                                        <Eye size={13} />
                                        <span>Read Notice</span>
                                    </button>

                                    <button
                                        onClick={(e) => handleDeleteNotice(notice.id || notice.notice_id, e)}
                                        className="btn btn-sm text-secondary p-1 border-0"
                                        title="Delete notice"
                                        style={{ opacity: 0.6 }}
                                        onMouseEnter={(e) => { e.currentTarget.style.opacity = 1; e.currentTarget.style.color = "#dc2626"; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.opacity = 0.6; e.currentTarget.style.color = ""; }}
                                    >
                                        <Trash size={15} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : viewMode === "table" ? (
                /* === TABLE VIEW === */
                <div className="bg-white rounded-3 border overflow-hidden" style={{ borderColor: "#e2e8f0" }}>
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0" style={{ fontSize: "0.85rem" }}>
                            <thead style={{ background: "#f8fafc", color: "#475569" }}>
                                <tr>
                                    <th className="ps-3 py-2 fw-semibold">Type</th>
                                    <th className="py-2 fw-semibold">Title</th>
                                    <th className="py-2 fw-semibold">Audience</th>
                                    <th className="py-2 fw-semibold">Issued By</th>
                                    <th className="py-2 fw-semibold">Date</th>
                                    <th className="py-2 fw-semibold">Valid Until</th>
                                    <th className="pe-3 text-end py-2 fw-semibold">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredNotices.map((n, idx) => (
                                    <tr
                                        key={n.id || n.notice_id || idx}
                                        onClick={() => setSelectedNotice(n)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <td className="ps-3">
                                            <span
                                                style={{
                                                    fontSize: "0.72rem",
                                                    fontWeight: "600",
                                                    color: "#1d4ed8",
                                                    background: "#eff6ff",
                                                    padding: "2px 8px",
                                                    borderRadius: "4px"
                                                }}
                                            >
                                                {n.category || "General"}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="fw-semibold text-dark">{n.title}</div>
                                            <div className="text-secondary small text-truncate" style={{ maxWidth: "340px" }}>
                                                {n.body}
                                            </div>
                                        </td>
                                        <td>
                                            <span className="text-secondary small">
                                                {n.target_audience === "owners" ? "Owners" : n.target_audience === "tenants" ? "Tenants" : "All Residents"}
                                            </span>
                                        </td>
                                        <td className="text-secondary">{n.issuer_name || "Management"}</td>
                                        <td className="text-muted">{formatDateSafe(n.issue_date)}</td>
                                        <td className="text-muted">{formatDateSafe(n.valid_until)}</td>
                                        <td className="pe-3 text-end" onClick={(e) => e.stopPropagation()}>
                                            <button
                                                onClick={(e) => handleDeleteNotice(n.id || n.notice_id, e)}
                                                className="btn btn-sm text-secondary p-1 border-0"
                                                title="Delete"
                                            >
                                                <Trash size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                /* === CARDS GRID VIEW === */
                <div className="row g-3">
                    {filteredNotices.map((notice, idx) => (
                        <div key={notice.id || notice.notice_id || idx} className="col-12 col-md-6 col-lg-4">
                            <div
                                className="bg-white p-4 h-100 d-flex flex-column justify-content-between rounded-3 border"
                                onClick={() => setSelectedNotice(notice)}
                                style={{
                                    borderColor: "#e2e8f0",
                                    cursor: "pointer",
                                    transition: "border-color 0.2s, box-shadow 0.2s"
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = "#93c5fd";
                                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(37, 99, 235, 0.06)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = "#e2e8f0";
                                    e.currentTarget.style.boxShadow = "none";
                                }}
                            >
                                <div>
                                    <div className="d-flex align-items-center justify-content-between gap-2 mb-2 pb-1">
                                        <span
                                            style={{
                                                fontSize: "0.72rem",
                                                fontWeight: "600",
                                                color: "#1d4ed8",
                                                background: "#eff6ff",
                                                padding: "3px 8px",
                                                borderRadius: "4px",
                                                textTransform: "uppercase",
                                                letterSpacing: "0.04em"
                                            }}
                                        >
                                            {notice.category || "General"}
                                        </span>

                                        <span className="text-muted small" style={{ fontSize: "0.72rem" }}>
                                            {notice.target_audience === "owners" ? "Owners" : notice.target_audience === "tenants" ? "Tenants" : "All Residents"}
                                        </span>
                                    </div>

                                    <h6 className="fw-bold text-dark mb-2" style={{ lineHeight: 1.4, fontSize: "0.95rem" }}>
                                        {notice.title}
                                    </h6>

                                    <p className="text-secondary small mb-3" style={{ fontSize: "0.82rem", lineHeight: 1.6 }}>
                                        {notice.body && notice.body.length > 130
                                            ? notice.body.substring(0, 130) + "..."
                                            : notice.body}
                                    </p>
                                </div>

                                <div className="pt-3 border-top mt-2">
                                    <div className="d-flex align-items-center justify-content-between mb-2">
                                        <span className="small text-dark fw-medium" style={{ fontSize: "0.78rem" }}>
                                            {notice.issuer_name || "Management Office"}
                                        </span>

                                        <button
                                            onClick={(e) => handleDeleteNotice(notice.id || notice.notice_id, e)}
                                            className="btn btn-sm text-secondary p-0 border-0"
                                            title="Delete"
                                        >
                                            <Trash size={14} />
                                        </button>
                                    </div>

                                    <div className="d-flex align-items-center justify-content-between text-muted" style={{ fontSize: "0.72rem" }}>
                                        <span>Issued: {formatDateSafe(notice.issue_date)}</span>
                                        <span>Valid until: {formatDateSafe(notice.valid_until)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 4. Animated Create Notice Modal */}
            <CreateNoticeModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onAddNotice={handleAddNotice}
            />

            {/* 5. Detail View Dialog with Brand Blue Styling */}
            <AnimatePresence>
                {selectedNotice && (
                    <motion.div
                        key="notice-detail-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        onClick={(e) => {
                            if (e.target === e.currentTarget) setSelectedNotice(null);
                        }}
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            zIndex: 1060,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "20px",
                            background: "rgba(15, 23, 42, 0.55)"
                        }}
                    >
                        <motion.div
                            key="notice-detail-dialog"
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: 10 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                position: "relative",
                                width: "100%",
                                maxWidth: "600px",
                                background: "#ffffff",
                                borderRadius: "12px",
                                border: "1px solid #e2e8f0",
                                boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.15)",
                                overflow: "hidden",
                                zIndex: 1
                            }}
                        >
                            <div className="p-3 px-4 border-bottom d-flex align-items-center justify-content-between bg-light">
                                <span
                                    style={{
                                        fontSize: "0.72rem",
                                        fontWeight: "700",
                                        color: "#1d4ed8",
                                        background: "#eff6ff",
                                        border: "1px solid #bfdbfe",
                                        padding: "3px 10px",
                                        borderRadius: "4px",
                                        textTransform: "uppercase",
                                        letterSpacing: "0.04em"
                                    }}
                                >
                                    {selectedNotice.category || "General Notice"}
                                </span>
                                <button
                                    onClick={() => setSelectedNotice(null)}
                                    className="btn btn-sm text-secondary p-0 border-0"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-4">
                                <h5 className="fw-bold text-dark mb-3" style={{ fontSize: "1.15rem", lineHeight: 1.35 }}>
                                    {selectedNotice.title}
                                </h5>

                                <div
                                    className="p-3 rounded-2 mb-4 bg-light text-secondary"
                                    style={{ fontSize: "0.92rem", lineHeight: 1.65, border: "1px solid #f1f5f9" }}
                                >
                                    {selectedNotice.body}
                                </div>

                                <div className="row g-2 small text-secondary">
                                    <div className="col-6">
                                        <strong>Issued By:</strong> {selectedNotice.issuer_name || "Management Office"}
                                    </div>
                                    <div className="col-6">
                                        <strong>Audience:</strong> {selectedNotice.target_audience === "owners" ? "Owners Only" : selectedNotice.target_audience === "tenants" ? "Tenants Only" : "All Residents"}
                                    </div>
                                    <div className="col-6">
                                        <strong>Effective:</strong> {formatDateSafe(selectedNotice.issue_date)}
                                    </div>
                                    <div className="col-6">
                                        <strong>Valid Until:</strong> {formatDateSafe(selectedNotice.valid_until)}
                                    </div>
                                </div>
                            </div>

                            <div className="p-3 bg-light border-top d-flex justify-content-end">
                                <button
                                    onClick={() => setSelectedNotice(null)}
                                    className="btn btn-sm btn-primary px-3"
                                    style={{ borderRadius: "6px", background: "#2563eb", borderColor: "#2563eb" }}
                                >
                                    Done
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default NoticeView;
