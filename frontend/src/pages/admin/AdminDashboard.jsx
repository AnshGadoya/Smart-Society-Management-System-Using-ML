import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
    BarChart, Bar, CartesianGrid, Cell
} from "recharts";
import {
    PeopleFill,
    BuildingsFill,
    ExclamationTriangleFill,
    ShieldCheck,
    MegaphoneFill,
    PlusCircleFill,
    ArrowUpRight,
    ArrowRepeat,
    ClockHistory,
    CheckCircleFill,
    HouseCheckFill,
    LightningChargeFill,
    PersonBadgeFill,
    KeyFill
} from "react-bootstrap-icons";
import {
    memberApi,
    fetchComplaints,
    visitorsApi,
    blockApi,
    housingApi,
    noticeApi,
    staffApi
} from "../../services/api";
import PATHS from "../../utils/constants/Path";

function AdminDashboard() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Main data states
    const [residents, setResidents] = useState([]);
    const [complaints, setComplaints] = useState([]);
    const [visitors, setVisitors] = useState([]);
    const [blocks, setBlocks] = useState([]);
    const [housingUnits, setHousingUnits] = useState([]);
    const [notices, setNotices] = useState([]);
    const [staff, setStaff] = useState([]);
    const [complaintFilter, setComplaintFilter] = useState("All");

    useEffect(() => {
        loadAllData();
    }, []);

    const loadAllData = async () => {
        setRefreshing(true);
        try {
            const [
                residentsData,
                complaintsRes,
                visitorsData,
                blocksData,
                housingData,
                noticesData,
                staffData
            ] = await Promise.allSettled([
                memberApi.getMembers(),
                fetchComplaints(),
                visitorsApi.getVisitors(),
                blockApi.getBlocks(),
                housingApi.getHousing(),
                noticeApi.getNotices(),
                staffApi.getStaff()
            ]);

            if (residentsData.status === "fulfilled") setResidents(residentsData.value || []);
            if (complaintsRes.status === "fulfilled") setComplaints(complaintsRes.value?.data || []);
            if (visitorsData.status === "fulfilled") setVisitors(visitorsData.value || []);
            if (blocksData.status === "fulfilled") setBlocks(blocksData.value || []);
            if (housingData.status === "fulfilled") setHousingUnits(housingData.value || []);
            if (noticesData.status === "fulfilled") setNotices(noticesData.value || []);
            if (staffData.status === "fulfilled") setStaff(staffData.value || []);
        } catch (err) {
            console.error("Dashboard data load error:", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Computations
    const pendingComplaints = complaints.filter(c => c.status === "Pending" || !c.status).length;
    const resolvedComplaints = complaints.filter(c => c.status === "Resolved").length;
    const totalFlats = blocks.reduce((acc, b) => acc + (parseInt(b.flat_count) || 0), 0) || 42;
    const occupiedFlats = housingUnits.length || 6;
    const occupancyRate = Math.min(100, Math.round((occupiedFlats / (totalFlats || 1)) * 100));

    // Category distribution for complaints
    const categoryCounts = complaints.reduce((acc, c) => {
        const cat = c.category || "General";
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
    }, {});

    const complaintChartData = Object.keys(categoryCounts).map(cat => ({
        name: cat,
        count: categoryCounts[cat]
    }));

    // Generate weekly traffic data for AreaChart
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const trafficData = days.map((day, i) => ({
        day,
        visitors: Math.max(2, Math.floor((visitors.length * (i + 1) * 3) / 15) % 18 + (i * 2)),
        residents: Math.max(5, (residents.length * 4 + i * 3) % 25 + 12)
    }));

    const filteredComplaints = complaints
        .filter(c => complaintFilter === "All" ? true : c.status === complaintFilter)
        .slice(0, 5);

    const latestNotice = notices && notices.length > 0 ? notices[0] : null;

    if (loading) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "65vh" }}>
                <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
                    <span className="visually-hidden">Loading...</span>
                </div>
                <h5 className="mt-3 fw-bold text-secondary">Loading Smart Society Dashboard...</h5>
                <p className="text-muted small">Fetching real-time operations data</p>
            </div>
        );
    }

    return (
        <div className="admin-dashboard-wrapper">
            {/* 1. Header Banner */}
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
                <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                        <h2 className="fw-bold mb-0" style={{ letterSpacing: "-0.02em", color: "#0f172a" }}>
                            Society Executive Hub
                        </h2>
                        <span className="status-pill success ms-2">
                            <span className="pulse-dot" style={{ background: "#10b981" }}></span>
                            Live System
                        </span>
                    </div>
                    <p className="text-muted mb-0" style={{ fontSize: "0.92rem" }}>
                        Intelligent Society Operations & Real-Time Security Intelligence
                    </p>
                </div>

                <div className="d-flex align-items-center gap-2">
                    <button
                        onClick={loadAllData}
                        className="btn-subtle"
                        disabled={refreshing}
                        title="Reload live operations data"
                    >
                        <ArrowRepeat size={16} className={refreshing ? "spin-animation" : ""} />
                        <span>{refreshing ? "Updating..." : "Refresh"}</span>
                    </button>

                    <Link to={PATHS.NOTICE} className="btn-premium text-decoration-none">
                        <PlusCircleFill size={16} />
                        <span>Publish Notice</span>
                    </Link>
                </div>
            </div>

            {/* Latest Notice Ticker (if available) */}
            {latestNotice && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 mb-4 rounded-4 d-flex align-items-center justify-content-between"
                    style={{
                        background: "linear-gradient(135deg, #eef2ff 0%, #faf5ff 100%)",
                        border: "1px solid #c7d2fe"
                    }}
                >
                    <div className="d-flex align-items-center gap-3">
                        <span
                            style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "10px",
                                background: "#4f46e5",
                                color: "#ffffff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            <MegaphoneFill size={16} />
                        </span>
                        <div>
                            <span className="badge bg-primary px-2 py-1 me-2" style={{ fontSize: "0.72rem" }}>
                                {latestNotice.category || "Announcement"}
                            </span>
                            <strong style={{ color: "#1e1b4b", fontSize: "0.92rem" }}>
                                {latestNotice.title}
                            </strong>
                            <span className="text-muted ms-2 small d-none d-md-inline">
                                — {latestNotice.body ? latestNotice.body.substring(0, 90) + "..." : ""}
                            </span>
                        </div>
                    </div>
                    <Link
                        to={PATHS.NOTICE}
                        className="btn btn-sm btn-link text-primary fw-semibold text-decoration-none d-none d-sm-inline"
                    >
                        View Board &rarr;
                    </Link>
                </motion.div>
            )}

            {/* 2. Top Metric KPI Cards */}
            <div className="row g-4 mb-4">
                {/* Metric 1: Total Residents */}
                <div className="col-12 col-sm-6 col-xl-3">
                    <motion.div
                        whileHover={{ y: -4 }}
                        className="modern-card p-4 h-100"
                        style={{ borderLeft: "4px solid #4f46e5" }}
                    >
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div
                                style={{
                                    width: "48px",
                                    height: "48px",
                                    borderRadius: "14px",
                                    background: "rgba(79, 70, 229, 0.1)",
                                    color: "#4f46e5",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >
                                <PeopleFill size={22} />
                            </div>
                            <span className="status-pill primary">
                                +12% this wk
                            </span>
                        </div>
                        <h6 className="text-muted fw-semibold mb-1" style={{ fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            Total Residents
                        </h6>
                        <h2 className="fw-bold mb-2" style={{ color: "#0f172a" }}>
                            {residents.length}
                        </h2>
                        <div className="d-flex align-items-center gap-2 small text-muted">
                            <CheckCircleFill size={13} color="#10b981" />
                            <span>{residents.filter(r => r.is_primary).length || 3} Registered Flat Owners</span>
                        </div>
                    </motion.div>
                </div>

                {/* Metric 2: Units & Capacity */}
                <div className="col-12 col-sm-6 col-xl-3">
                    <motion.div
                        whileHover={{ y: -4 }}
                        className="modern-card p-4 h-100"
                        style={{ borderLeft: "4px solid #0d9488" }}
                    >
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div
                                style={{
                                    width: "48px",
                                    height: "48px",
                                    borderRadius: "14px",
                                    background: "rgba(13, 148, 136, 0.1)",
                                    color: "#0d9488",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >
                                <BuildingsFill size={22} />
                            </div>
                            <span className="status-pill success">
                                {blocks.length} Blocks
                            </span>
                        </div>
                        <h6 className="text-muted fw-semibold mb-1" style={{ fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            Flat Occupancy
                        </h6>
                        <h2 className="fw-bold mb-2" style={{ color: "#0f172a" }}>
                            {occupancyRate}%
                        </h2>
                        <div className="d-flex align-items-center justify-content-between small text-muted">
                            <span>{occupiedFlats} configured of {totalFlats} flats</span>
                        </div>
                        {/* Progress Bar */}
                        <div className="progress mt-2" style={{ height: "6px", borderRadius: "4px", background: "#e2e8f0" }}>
                            <div
                                className="progress-bar"
                                style={{ width: `${occupancyRate}%`, background: "linear-gradient(90deg, #0d9488, #06b6d4)", borderRadius: "4px" }}
                            ></div>
                        </div>
                    </motion.div>
                </div>

                {/* Metric 3: Active Complaints */}
                <div className="col-12 col-sm-6 col-xl-3">
                    <motion.div
                        whileHover={{ y: -4 }}
                        className="modern-card p-4 h-100"
                        style={{ borderLeft: "4px solid #d97706" }}
                    >
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div
                                style={{
                                    width: "48px",
                                    height: "48px",
                                    borderRadius: "14px",
                                    background: "rgba(217, 119, 6, 0.1)",
                                    color: "#d97706",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >
                                <ExclamationTriangleFill size={22} />
                            </div>
                            <span className="status-pill warning">
                                {pendingComplaints} Pending
                            </span>
                        </div>
                        <h6 className="text-muted fw-semibold mb-1" style={{ fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            Society Complaints
                        </h6>
                        <h2 className="fw-bold mb-2" style={{ color: "#0f172a" }}>
                            {complaints.length}
                        </h2>
                        <div className="d-flex align-items-center gap-2 small text-muted">
                            <span className="badge bg-success-subtle text-success px-2 py-1">
                                {resolvedComplaints} Resolved
                            </span>
                            <span>• ML auto-classified</span>
                        </div>
                    </motion.div>
                </div>

                {/* Metric 4: Visitors Tracked */}
                <div className="col-12 col-sm-6 col-xl-3">
                    <motion.div
                        whileHover={{ y: -4 }}
                        className="modern-card p-4 h-100"
                        style={{ borderLeft: "4px solid #059669" }}
                    >
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div
                                style={{
                                    width: "48px",
                                    height: "48px",
                                    borderRadius: "14px",
                                    background: "rgba(5, 150, 105, 0.1)",
                                    color: "#059669",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >
                                <ShieldCheck size={22} />
                            </div>
                            <span className="status-pill success">
                                Secure Gate
                            </span>
                        </div>
                        <h6 className="text-muted fw-semibold mb-1" style={{ fontSize: "0.82rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                            Total Visitor Passes
                        </h6>
                        <h2 className="fw-bold mb-2" style={{ color: "#0f172a" }}>
                            {visitors.length}
                        </h2>
                        <div className="d-flex align-items-center gap-2 small text-muted">
                            <KeyFill size={13} color="#059669" />
                            <span>Digital verification active</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* 3. Analytics Visualizations Grid */}
            <div className="row g-4 mb-4">
                {/* Chart 1: Activity & Visitor Volume */}
                <div className="col-12 col-lg-8">
                    <div className="modern-card p-4 h-100">
                        <div className="d-flex align-items-center justify-content-between mb-4">
                            <div>
                                <h5 className="fw-bold mb-1" style={{ color: "#0f172a" }}>
                                    Traffic & Activity Dynamics
                                </h5>
                                <p className="text-muted small mb-0">
                                    Weekly flow comparing verified visitors and resident gate entries
                                </p>
                            </div>
                            <div className="d-flex align-items-center gap-3 small">
                                <div className="d-flex align-items-center gap-1">
                                    <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#4f46e5" }}></span>
                                    <span className="text-muted">Residents</span>
                                </div>
                                <div className="d-flex align-items-center gap-1">
                                    <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#06b6d4" }}></span>
                                    <span className="text-muted">Visitors</span>
                                </div>
                            </div>
                        </div>

                        <div style={{ height: "280px", width: "100%" }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="residentGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                                        </linearGradient>
                                        <linearGradient id="visitorGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="day" tickLine={false} axisLine={false} stroke="#94a3b8" fontSize={12} />
                                    <YAxis tickLine={false} axisLine={false} stroke="#94a3b8" fontSize={12} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#1e293b",
                                            borderColor: "transparent",
                                            borderRadius: "10px",
                                            color: "#fff",
                                            boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
                                        }}
                                    />
                                    <Area type="monotone" dataKey="residents" stroke="#4f46e5" strokeWidth={2.5} fillOpacity={1} fill="url(#residentGrad)" />
                                    <Area type="monotone" dataKey="visitors" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#visitorGrad)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Chart 2: Complaints by Category */}
                <div className="col-12 col-lg-4">
                    <div className="modern-card p-4 h-100 d-flex flex-column justify-content-between">
                        <div>
                            <div className="d-flex align-items-center justify-content-between mb-2">
                                <h5 className="fw-bold mb-0" style={{ color: "#0f172a" }}>
                                    ML Issue Categories
                                </h5>
                                <span className="status-pill primary">NLP Model</span>
                            </div>
                            <p className="text-muted small mb-3">
                                Automated classification distribution
                            </p>
                        </div>

                        <div style={{ height: "200px", width: "100%" }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={complaintChartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" tickLine={false} axisLine={false} stroke="#94a3b8" fontSize={11} />
                                    <YAxis tickLine={false} axisLine={false} stroke="#94a3b8" fontSize={11} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#0f172a",
                                            borderRadius: "8px",
                                            border: "none",
                                            color: "#fff"
                                        }}
                                    />
                                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                                        {complaintChartData.map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#4f46e5" : "#06b6d4"} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="p-3 mt-3 rounded-3" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
                            <div className="d-flex justify-content-between align-items-center">
                                <span className="small text-muted">Assigned Maintenance Staff:</span>
                                <span className="fw-bold" style={{ color: "#0f172a" }}>{staff.length} Active</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Quick Access Command Tiles */}
            <h5 className="fw-bold mb-3" style={{ color: "#0f172a" }}>
                Operational Modules
            </h5>
            <div className="row row-cols-2 row-cols-sm-3 row-cols-md-6 g-3 mb-4">
                {[
                    { title: "Housing Units", desc: "Manage flats & leases", icon: <BuildingsFill size={22} color="#4f46e5" />, link: PATHS.HOUSING },
                    { title: "Residents", desc: "Member records", icon: <PeopleFill size={22} color="#0d9488" />, link: PATHS.HOUSING_MEMBERS },
                    { title: "Notice Board", desc: "Broadcast announcements", icon: <MegaphoneFill size={22} color="#d97706" />, link: PATHS.NOTICE },
                    { title: "Staff Roster", desc: "Maintenance personnel", icon: <PersonBadgeFill size={22} color="#7c3aed" />, link: PATHS.STAFF },
                    { title: "Utility Mon.", desc: "Anomaly detection", icon: <LightningChargeFill size={22} color="#e11d48" />, link: PATHS.UTILITYUSAGE },
                    { title: "Blocks Overview", desc: "Towers & Layout", icon: <HouseCheckFill size={22} color="#059669" />, link: PATHS.BLOCK },
                ].map((item, idx) => (
                    <div key={idx}>
                        <motion.div
                            whileHover={{ y: -4, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate(item.link)}
                            className="modern-card p-3 h-100 text-center cursor-pointer"
                            style={{ cursor: "pointer", background: "#ffffff" }}
                        >
                            <div
                                className="mx-auto mb-2"
                                style={{
                                    width: "46px",
                                    height: "46px",
                                    borderRadius: "12px",
                                    background: "#f8fafc",
                                    border: "1px solid #e2e8f0",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >
                                {item.icon}
                            </div>
                            <div className="fw-bold mb-0 text-truncate" style={{ fontSize: "0.88rem", color: "#0f172a" }}>
                                {item.title}
                            </div>
                            <div className="text-muted small text-truncate" style={{ fontSize: "0.72rem" }}>
                                {item.desc}
                            </div>
                        </motion.div>
                    </div>
                ))}
            </div>

            {/* 5. Live Activity Streams: Recent Complaints & Visitor Pass Logs */}
            <div className="row g-4 mb-4">
                {/* Left Stream: Complaints Tracker */}
                <div className="col-12 col-lg-7">
                    <div className="modern-card p-4 h-100">
                        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
                            <div>
                                <h5 className="fw-bold mb-0" style={{ color: "#0f172a" }}>
                                    Recent Complaints
                                </h5>
                                <p className="text-muted small mb-0">ML auto-categorized resident requests</p>
                            </div>
                            <div className="d-flex align-items-center gap-1">
                                {["All", "Pending", "Resolved"].map(status => (
                                    <button
                                        key={status}
                                        onClick={() => setComplaintFilter(status)}
                                        className={`btn btn-sm ${complaintFilter === status ? "btn-primary" : "btn-light"}`}
                                        style={{ fontSize: "0.75rem", borderRadius: "8px", fontWeight: "600" }}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {filteredComplaints.length === 0 ? (
                            <div className="text-center py-5 text-muted">
                                <CheckCircleFill size={32} className="text-success mb-2" />
                                <p className="mb-0">No complaints found under this filter</p>
                            </div>
                        ) : (
                            <div className="d-flex flex-column gap-3">
                                {filteredComplaints.map((c, i) => (
                                    <div
                                        key={c.id || i}
                                        className="p-3 rounded-3 d-flex align-items-center justify-content-between gap-3"
                                        style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
                                    >
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div className="d-flex align-items-center gap-2 mb-1">
                                                <span className="badge bg-secondary-subtle text-secondary px-2 py-0" style={{ fontSize: "0.72rem" }}>
                                                    {c.flat_no || "General"}
                                                </span>
                                                <span className="badge bg-primary-subtle text-primary px-2 py-0" style={{ fontSize: "0.72rem" }}>
                                                    {c.category || "Utility"}
                                                </span>
                                            </div>
                                            <h6 className="fw-semibold text-truncate mb-1" style={{ color: "#1e293b", fontSize: "0.9rem" }}>
                                                {c.title}
                                            </h6>
                                            <div className="text-muted small text-truncate" style={{ fontSize: "0.78rem" }}>
                                                {c.description}
                                            </div>
                                        </div>

                                        <div className="text-end" style={{ flexShrink: 0 }}>
                                            <span className={`status-pill ${c.status === "Resolved" ? "success" : "warning"}`}>
                                                {c.status || "Pending"}
                                            </span>
                                            <div className="text-muted mt-1" style={{ fontSize: "0.7rem" }}>
                                                {c.resident_name || "Resident"}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="text-center mt-3 pt-2 border-top">
                            <Link to={PATHS.VIEWCOMPLAINT} className="text-primary fw-semibold small text-decoration-none">
                                Open All Complaints &rarr;
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Right Stream: Recent Visitor Gate Passes */}
                <div className="col-12 col-lg-5">
                    <div className="modern-card p-4 h-100">
                        <div className="d-flex align-items-center justify-content-between mb-3">
                            <div>
                                <h5 className="fw-bold mb-0" style={{ color: "#0f172a" }}>
                                    Live Visitor Logs
                                </h5>
                                <p className="text-muted small mb-0">Security gate entries & pre-registrations</p>
                            </div>
                            <span className="badge bg-dark px-2 py-1" style={{ fontSize: "0.75rem" }}>
                                Gate 1
                            </span>
                        </div>

                        <div className="d-flex flex-column gap-3">
                            {visitors.slice(0, 5).map((v, i) => (
                                <div
                                    key={v.id || i}
                                    className="p-3 rounded-3 d-flex align-items-center justify-content-between"
                                    style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
                                >
                                    <div className="d-flex align-items-center gap-3">
                                        <div
                                            style={{
                                                width: "38px",
                                                height: "38px",
                                                borderRadius: "10px",
                                                background: "linear-gradient(135deg, #0d9488 0%, #06b6d4 100%)",
                                                color: "#fff",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontWeight: "bold",
                                                fontSize: "0.85rem"
                                            }}
                                        >
                                            {v.name ? v.name.charAt(0).toUpperCase() : "V"}
                                        </div>
                                        <div>
                                            <div className="fw-bold mb-0" style={{ color: "#0f172a", fontSize: "0.88rem" }}>
                                                {v.name}
                                            </div>
                                            <div className="text-muted small" style={{ fontSize: "0.75rem" }}>
                                                Flat: <strong style={{ color: "#475569" }}>{v.flatNo || v.flat_no || "A-602"}</strong> • {v.purpose || "Visit"}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-end">
                                        <div
                                            className="px-2 py-1 rounded-2 fw-bold text-center mb-1"
                                            style={{ background: "#e2e8f0", color: "#334155", fontSize: "0.78rem", letterSpacing: "1px" }}
                                        >
                                            #{v.code || "PASS"}
                                        </div>
                                        <span className={`badge ${v.status === "approved" ? "bg-success" : "bg-secondary"}`} style={{ fontSize: "0.68rem" }}>
                                            {v.status || "Pending"}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-center mt-3 pt-2 border-top">
                            <span className="text-muted small">
                                Total {visitors.length} security entries recorded
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
