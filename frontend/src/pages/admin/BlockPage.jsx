import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    BuildingsFill,
    Building,
    Plus,
    Search,
    Trash,
    PencilSquare,
    ArrowRepeat,
    CheckCircleFill,
    HouseDoor,
    Layers,
    X,
    Grid,
    ListUl,
    InfoCircle
} from "react-bootstrap-icons";
import { blockApi, housingApi } from "../../services/api";

function HousingBlockPage() {
    const [blocks, setBlocks] = useState([]);
    const [housingUnits, setHousingUnits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Filters and search
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState("cards"); // 'cards' or 'table'

    // Modals
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingBlock, setEditingBlock] = useState(null);
    const [alertMessage, setAlertMessage] = useState(null);

    // Form inputs for Add
    const [addForm, setAddForm] = useState({ block_name: "", flat_count: "" });
    const [addErrors, setAddErrors] = useState({});
    const [addLoading, setAddLoading] = useState(false);

    // Form inputs for Edit
    const [editForm, setEditForm] = useState({ block_name: "", flat_count: "" });
    const [editErrors, setEditErrors] = useState({});
    const [editLoading, setEditLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setRefreshing(true);
        try {
            const [blocksRes, housingRes] = await Promise.allSettled([
                blockApi.getBlocks(),
                housingApi.getHousing()
            ]);

            if (blocksRes.status === "fulfilled") setBlocks(blocksRes.value || []);
            if (housingRes.status === "fulfilled") setHousingUnits(housingRes.value || []);
        } catch (err) {
            console.error("Error fetching blocks & housing data:", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Calculate configured units per block
    const getConfiguredCount = (blockId, blockName) => {
        return housingUnits.filter(u =>
            (u.block_id && String(u.block_id) === String(blockId)) ||
            (u.block_name && blockName && u.block_name.toLowerCase() === blockName.toLowerCase())
        ).length;
    };

    // Computations for KPI cards
    const totalBlocks = blocks.length;
    const totalCapacity = blocks.reduce((acc, b) => acc + (parseInt(b.flat_count) || 0), 0);
    const totalConfigured = housingUnits.length;
    const avgFlats = totalBlocks > 0 ? (totalCapacity / totalBlocks).toFixed(1) : 0;

    // Filter computation
    const filteredBlocks = blocks.filter(b => {
        const q = searchQuery.toLowerCase().trim();
        if (!q) return true;
        const nameMatch = b.block_name && b.block_name.toLowerCase().includes(q);
        const idMatch = b.id && String(b.id).includes(q);
        return nameMatch || idMatch;
    });

    // Delete handler
    const handleDelete = async (blockId, blockName, e) => {
        if (e) e.stopPropagation();
        if (!window.confirm(`Are you sure you want to delete Block "${blockName}" (ID: ${blockId})?`)) return;

        try {
            await blockApi.deleteBlock(blockId);
            setBlocks(prev => prev.filter(b => b.id !== blockId));
            setAlertMessage({ type: "success", text: `Block "${blockName}" successfully removed.` });
            setTimeout(() => setAlertMessage(null), 3000);
        } catch (err) {
            console.error("Error deleting block", err);
            setAlertMessage({ type: "danger", text: "Failed to delete block. Please check if units exist under this block." });
            setTimeout(() => setAlertMessage(null), 3500);
        }
    };

    // Handle Create Block
    const handleAddSubmit = async (e) => {
        e.preventDefault();
        const errs = {};
        if (!addForm.block_name.trim()) errs.block_name = "Block name is required";
        if (!addForm.flat_count || parseInt(addForm.flat_count, 10) <= 0) {
            errs.flat_count = "Flat count must be a positive number";
        }

        if (Object.keys(errs).length > 0) {
            setAddErrors(errs);
            return;
        }

        setAddLoading(true);
        try {
            await blockApi.addBlock({
                block_name: addForm.block_name.trim(),
                flat_count: parseInt(addForm.flat_count, 10)
            });

            setAlertMessage({ type: "success", text: `Block "${addForm.block_name}" created successfully!` });
            setTimeout(() => setAlertMessage(null), 3000);
            setAddForm({ block_name: "", flat_count: "" });
            setIsAddModalOpen(false);
            loadData();
        } catch (err) {
            console.error("Error creating block:", err);
            setAlertMessage({ type: "danger", text: "Failed to create block. Please try again." });
            setTimeout(() => setAlertMessage(null), 3500);
        } finally {
            setAddLoading(false);
        }
    };

    // Handle Open Edit
    const handleOpenEdit = (block, e) => {
        if (e) e.stopPropagation();
        setEditingBlock(block);
        setEditForm({
            block_name: block.block_name || "",
            flat_count: block.flat_count || 0
        });
        setEditErrors({});
    };

    // Handle Save Edit
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!editingBlock) return;

        const errs = {};
        if (!editForm.block_name.trim()) errs.block_name = "Block name is required";
        if (!editForm.flat_count || parseInt(editForm.flat_count, 10) <= 0) {
            errs.flat_count = "Flat count must be a positive number";
        }

        if (Object.keys(errs).length > 0) {
            setEditErrors(errs);
            return;
        }

        setEditLoading(true);
        try {
            await blockApi.updateBlock(editingBlock.id, {
                block_name: editForm.block_name.trim(),
                flat_count: parseInt(editForm.flat_count, 10)
            });

            setAlertMessage({ type: "success", text: `Block "${editForm.block_name}" updated successfully.` });
            setTimeout(() => setAlertMessage(null), 3000);
            setEditingBlock(null);
            loadData();
        } catch (err) {
            console.error("Error updating block:", err);
            setAlertMessage({ type: "danger", text: "Failed to update block." });
            setTimeout(() => setAlertMessage(null), 3500);
        } finally {
            setEditLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: "1280px", margin: "0 auto", paddingBottom: "40px", textAlign: "left" }}>
            {/* 1. Executive Corporate Header */}
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4 pb-3 border-bottom">
                <div>
                    <h3 className="fw-bold text-dark mb-1" style={{ letterSpacing: "-0.02em" }}>
                        Housing Block Management
                    </h3>
                    <p className="text-secondary small mb-0">
                        Configure society residential wings, towers, and planned flat capacity
                    </p>
                </div>

                <div className="d-flex align-items-center gap-2">
                    <button
                        onClick={loadData}
                        className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-2"
                        disabled={refreshing}
                        style={{ borderRadius: "8px", padding: "7px 14px", fontWeight: "500" }}
                    >
                        <ArrowRepeat size={14} className={refreshing ? "spin-animation" : ""} />
                        <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
                    </button>

                    <button
                        onClick={() => {
                            setAddForm({ block_name: "", flat_count: "" });
                            setAddErrors({});
                            setIsAddModalOpen(true);
                        }}
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
                        <span>Add New Block</span>
                    </button>
                </div>
            </div>

            {/* Alert Notification */}
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

            {/* 2. Overview KPI Cards */}
            <div className="row g-3 mb-4">
                {/* Metric 1: Total Blocks */}
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="bg-white p-4 h-100 rounded-3 border" style={{ borderColor: "#e2e8f0" }}>
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div
                                style={{
                                    width: "42px",
                                    height: "42px",
                                    borderRadius: "8px",
                                    background: "#f8fafc",
                                    border: "1px solid #e2e8f0",
                                    color: "#334155",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >
                                <BuildingsFill size={19} />
                            </div>
                            <span className="status-pill success">Active Towers</span>
                        </div>
                        <div className="text-secondary fw-semibold mb-1" style={{ fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                            Residential Blocks
                        </div>
                        <div className="fw-bold mb-2 text-dark" style={{ fontSize: "1.85rem", lineHeight: 1.2 }}>
                            {totalBlocks}
                        </div>
                        <div className="d-flex align-items-center gap-1 small text-secondary" style={{ fontSize: "0.8rem" }}>
                            <CheckCircleFill size={12} color="#16a34a" />
                            <span>100% Operational Status</span>
                        </div>
                    </div>
                </div>

                {/* Metric 2: Total Flat Capacity */}
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="bg-white p-4 h-100 rounded-3 border" style={{ borderColor: "#e2e8f0" }}>
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div
                                style={{
                                    width: "42px",
                                    height: "42px",
                                    borderRadius: "8px",
                                    background: "#f8fafc",
                                    border: "1px solid #e2e8f0",
                                    color: "#334155",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >
                                <HouseDoor size={19} />
                            </div>
                            <span className="status-pill neutral">Total Capacity</span>
                        </div>
                        <div className="text-secondary fw-semibold mb-1" style={{ fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                            Total Planned Flats
                        </div>
                        <div className="fw-bold mb-2 text-dark" style={{ fontSize: "1.85rem", lineHeight: 1.2 }}>
                            {totalCapacity}
                        </div>
                        <div className="small text-secondary" style={{ fontSize: "0.8rem" }}>
                            <span>Across all configured blocks</span>
                        </div>
                    </div>
                </div>

                {/* Metric 3: Configured Units */}
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="bg-white p-4 h-100 rounded-3 border" style={{ borderColor: "#e2e8f0" }}>
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div
                                style={{
                                    width: "42px",
                                    height: "42px",
                                    borderRadius: "8px",
                                    background: "#f8fafc",
                                    border: "1px solid #e2e8f0",
                                    color: "#334155",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >
                                <Layers size={19} />
                            </div>
                            <span className="status-pill neutral">Configured</span>
                        </div>
                        <div className="text-secondary fw-semibold mb-1" style={{ fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                            Active Flat Records
                        </div>
                        <div className="fw-bold mb-2 text-dark" style={{ fontSize: "1.85rem", lineHeight: 1.2 }}>
                            {totalConfigured}
                        </div>
                        <div className="small text-secondary" style={{ fontSize: "0.8rem" }}>
                            <span>{Math.max(0, totalCapacity - totalConfigured)} slots available to register</span>
                        </div>
                    </div>
                </div>

                {/* Metric 4: Average Density */}
                <div className="col-12 col-sm-6 col-xl-3">
                    <div className="bg-white p-4 h-100 rounded-3 border" style={{ borderColor: "#e2e8f0" }}>
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div
                                style={{
                                    width: "42px",
                                    height: "42px",
                                    borderRadius: "8px",
                                    background: "#f8fafc",
                                    border: "1px solid #e2e8f0",
                                    color: "#334155",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                            >
                                <Building size={19} />
                            </div>
                            <span className="status-pill neutral">Density</span>
                        </div>
                        <div className="text-secondary fw-semibold mb-1" style={{ fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                            Avg Flats / Tower
                        </div>
                        <div className="fw-bold mb-2 text-dark" style={{ fontSize: "1.85rem", lineHeight: 1.2 }}>
                            {avgFlats}
                        </div>
                        <div className="small text-secondary" style={{ fontSize: "0.8rem" }}>
                            <span>Standard tower unit allocation</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Controls Bar: Search, Stats & View Mode Toggle */}
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
                        width: "300px"
                    }}
                >
                    <Search size={14} color="#64748b" />
                    <input
                        type="text"
                        placeholder="Search block name or ID..."
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

                {/* Filter info indicator */}
                <div className="small text-secondary d-none d-md-block">
                    Showing <strong style={{ color: "#0f172a" }}>{filteredBlocks.length}</strong> of {blocks.length} residential blocks
                </div>

                {/* View Switcher: Cards vs Table */}
                <div className="d-flex align-items-center gap-1 border rounded p-1" style={{ background: "#f8fafc" }}>
                    <button
                        onClick={() => setViewMode("cards")}
                        style={{
                            background: viewMode === "cards" ? "#ffffff" : "transparent",
                            border: "none",
                            borderRadius: "4px",
                            padding: "4px 10px",
                            color: viewMode === "cards" ? "#2563eb" : "#64748b",
                            boxShadow: viewMode === "cards" ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
                            cursor: "pointer",
                            fontSize: "0.8rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            fontWeight: viewMode === "cards" ? "600" : "500"
                        }}
                        title="Card Grid View"
                    >
                        <Grid size={13} />
                        <span>Tower Cards</span>
                    </button>
                    <button
                        onClick={() => setViewMode("table")}
                        style={{
                            background: viewMode === "table" ? "#ffffff" : "transparent",
                            border: "none",
                            borderRadius: "4px",
                            padding: "4px 10px",
                            color: viewMode === "table" ? "#2563eb" : "#64748b",
                            boxShadow: viewMode === "table" ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
                            cursor: "pointer",
                            fontSize: "0.8rem",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            fontWeight: viewMode === "table" ? "600" : "500"
                        }}
                        title="Table View"
                    >
                        <ListUl size={14} />
                        <span>Table</span>
                    </button>
                </div>
            </div>

            {/* 4. Content Area */}
            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary spinner-border-sm" role="status"></div>
                    <p className="text-muted small mt-2">Loading housing blocks...</p>
                </div>
            ) : filteredBlocks.length === 0 ? (
                <div className="text-center py-5 bg-white rounded-3 border" style={{ borderColor: "#e2e8f0" }}>
                    <BuildingsFill size={36} color="#94a3b8" className="mb-2" />
                    <h6 className="fw-bold text-dark mb-1">No Housing Blocks Found</h6>
                    <p className="text-muted small mb-3">No blocks match your search query.</p>
                    <button
                        onClick={() => {
                            setAddForm({ block_name: "", flat_count: "" });
                            setAddErrors({});
                            setIsAddModalOpen(true);
                        }}
                        className="btn btn-sm btn-primary"
                        style={{ borderRadius: "6px", background: "#2563eb", borderColor: "#2563eb" }}
                    >
                        Create First Block
                    </button>
                </div>
            ) : viewMode === "cards" ? (
                /* === MODERN TOWER CARDS VIEW === */
                <div className="row g-3">
                    {filteredBlocks.map((block) => {
                        const configured = getConfiguredCount(block.id, block.block_name);
                        const capacity = parseInt(block.flat_count, 10) || 0;
                        const percent = capacity > 0 ? Math.min(100, Math.round((configured / capacity) * 100)) : 0;

                        return (
                            <div key={block.id} className="col-12 col-md-6 col-lg-4">
                                <div
                                    className="bg-white p-4 h-100 rounded-3 border d-flex flex-column justify-content-between"
                                    style={{
                                        borderColor: "#e2e8f0",
                                        transition: "all 0.2s ease"
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
                                        {/* Card Top: Tower Badge & ID */}
                                        <div className="d-flex align-items-center justify-content-between mb-3">
                                            <div className="d-flex align-items-center gap-2">
                                                <div
                                                    style={{
                                                        width: "44px",
                                                        height: "44px",
                                                        borderRadius: "8px",
                                                        background: "#eff6ff",
                                                        border: "1px solid #bfdbfe",
                                                        color: "#1d4ed8",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        fontWeight: "700",
                                                        fontSize: "1.1rem"
                                                    }}
                                                >
                                                    {block.block_name ? block.block_name.charAt(0).toUpperCase() : "B"}
                                                </div>
                                                <div>
                                                    <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: "1rem" }}>
                                                        Block {block.block_name}
                                                    </h6>
                                                    <span className="text-secondary small" style={{ fontSize: "0.72rem" }}>
                                                        ID: #{block.id}
                                                    </span>
                                                </div>
                                            </div>

                                            <span
                                                style={{
                                                    fontSize: "0.72rem",
                                                    fontWeight: "600",
                                                    color: "#166534",
                                                    background: "#f0fdf4",
                                                    border: "1px solid #bbf7d0",
                                                    padding: "3px 8px",
                                                    borderRadius: "4px"
                                                }}
                                            >
                                                Active Wing
                                            </span>
                                        </div>

                                        {/* Capacity & Progress */}
                                        <div className="p-3 mb-3 rounded-2 bg-light border" style={{ borderColor: "#f1f5f9" }}>
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <span className="small text-secondary">Registered Units:</span>
                                                <span className="small fw-semibold text-dark">
                                                    {configured} / {capacity} Flats
                                                </span>
                                            </div>
                                            <div className="progress" style={{ height: "6px", borderRadius: "3px", background: "#e2e8f0" }}>
                                                <div
                                                    className="progress-bar"
                                                    style={{
                                                        width: `${percent}%`,
                                                        background: "#2563eb",
                                                        borderRadius: "3px"
                                                    }}
                                                ></div>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center mt-1 text-muted" style={{ fontSize: "0.7rem" }}>
                                                <span>{percent}% Configured</span>
                                                <span>{Math.max(0, capacity - configured)} remaining</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="d-flex align-items-center justify-content-between pt-3 border-top mt-2">
                                        <button
                                            onClick={(e) => handleOpenEdit(block, e)}
                                            className="btn btn-sm d-inline-flex align-items-center gap-1"
                                            style={{
                                                background: "#eff6ff",
                                                color: "#1d4ed8",
                                                border: "1px solid #bfdbfe",
                                                borderRadius: "6px",
                                                padding: "5px 12px",
                                                fontSize: "0.8rem",
                                                fontWeight: "600"
                                            }}
                                        >
                                            <PencilSquare size={13} />
                                            <span>Edit Block</span>
                                        </button>

                                        <button
                                            onClick={(e) => handleDelete(block.id, block.block_name, e)}
                                            className="btn btn-sm text-secondary p-1 border-0"
                                            title="Delete Block"
                                            style={{ opacity: 0.65 }}
                                            onMouseEnter={(e) => { e.currentTarget.style.opacity = 1; e.currentTarget.style.color = "#dc2626"; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.opacity = 0.65; e.currentTarget.style.color = ""; }}
                                        >
                                            <Trash size={15} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                /* === STRUCTURED TABLE VIEW === */
                <div className="bg-white rounded-3 border overflow-hidden" style={{ borderColor: "#e2e8f0" }}>
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0" style={{ fontSize: "0.86rem" }}>
                            <thead style={{ background: "#f8fafc", color: "#475569" }}>
                                <tr>
                                    <th className="ps-3 py-3 fw-semibold">Block Code</th>
                                    <th className="py-3 fw-semibold">Tower Name</th>
                                    <th className="py-3 fw-semibold">Total Planned Flats</th>
                                    <th className="py-3 fw-semibold">Configured Units</th>
                                    <th className="py-3 fw-semibold">Configuration Status</th>
                                    <th className="pe-3 text-end py-3 fw-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBlocks.map((block) => {
                                    const configured = getConfiguredCount(block.id, block.block_name);
                                    const capacity = parseInt(block.flat_count, 10) || 0;
                                    const percent = capacity > 0 ? Math.min(100, Math.round((configured / capacity) * 100)) : 0;

                                    return (
                                        <tr key={block.id}>
                                            <td className="ps-3">
                                                <span
                                                    style={{
                                                        fontSize: "0.75rem",
                                                        fontWeight: "600",
                                                        color: "#475569",
                                                        background: "#f1f5f9",
                                                        border: "1px solid #e2e8f0",
                                                        padding: "2px 8px",
                                                        borderRadius: "4px"
                                                    }}
                                                >
                                                    #BLK-{block.id}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <div
                                                        style={{
                                                            width: "30px",
                                                            height: "30px",
                                                            borderRadius: "6px",
                                                            background: "#eff6ff",
                                                            color: "#1d4ed8",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            fontWeight: "700",
                                                            fontSize: "0.85rem"
                                                        }}
                                                    >
                                                        {block.block_name ? block.block_name.charAt(0).toUpperCase() : "B"}
                                                    </div>
                                                    <span className="fw-semibold text-dark">
                                                        Block {block.block_name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <strong style={{ color: "#0f172a" }}>{capacity}</strong> Flats
                                            </td>
                                            <td>
                                                <span className="text-secondary">
                                                    {configured} Registered
                                                </span>
                                            </td>
                                            <td style={{ minWidth: "160px" }}>
                                                <div className="d-flex align-items-center gap-2">
                                                    <div className="progress flex-grow-1" style={{ height: "6px", borderRadius: "3px", background: "#e2e8f0" }}>
                                                        <div
                                                            className="progress-bar"
                                                            style={{
                                                                width: `${percent}%`,
                                                                background: "#2563eb",
                                                                borderRadius: "3px"
                                                            }}
                                                        ></div>
                                                    </div>
                                                    <span className="small text-secondary" style={{ fontSize: "0.74rem" }}>
                                                        {percent}%
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="pe-3 text-end">
                                                <button
                                                    onClick={(e) => handleOpenEdit(block, e)}
                                                    className="btn btn-sm btn-outline-primary me-2"
                                                    style={{ borderRadius: "6px", fontSize: "0.78rem", padding: "4px 10px" }}
                                                >
                                                    <PencilSquare size={13} className="me-1" />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={(e) => handleDelete(block.id, block.block_name, e)}
                                                    className="btn btn-sm btn-outline-danger"
                                                    style={{ borderRadius: "6px", fontSize: "0.78rem", padding: "4px 10px" }}
                                                >
                                                    <Trash size={13} className="me-1" />
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* 5. Add Block Modal (Non-blinking Direct Motion Component) */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <motion.div
                        key="add-block-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        onClick={(e) => {
                            if (e.target === e.currentTarget) setIsAddModalOpen(false);
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
                        <motion.div
                            key="add-block-dialog"
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: 10 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                position: "relative",
                                width: "100%",
                                maxWidth: "500px",
                                background: "#ffffff",
                                borderRadius: "12px",
                                border: "1px solid #e2e8f0",
                                boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.25)",
                                overflow: "hidden",
                                zIndex: 1
                            }}
                        >
                            {/* Modal Header */}
                            <div className="p-3 px-4 border-bottom d-flex align-items-center justify-content-between bg-white">
                                <div>
                                    <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: "1.05rem" }}>
                                        Add New Housing Block
                                    </h6>
                                    <small className="text-secondary">Register a new residential wing or tower</small>
                                </div>
                                <button
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="btn btn-sm text-secondary p-0 border-0"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Modal Form */}
                            <form onSubmit={handleAddSubmit} className="p-4">
                                <div className="mb-3">
                                    <label className="form-label fw-semibold text-dark small mb-1">
                                        Block / Tower Name <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. A, B, Tower Rose, Wing 1"
                                        value={addForm.block_name}
                                        onChange={(e) => {
                                            setAddForm(prev => ({ ...prev, block_name: e.target.value }));
                                            if (addErrors.block_name) setAddErrors(prev => ({ ...prev, block_name: "" }));
                                        }}
                                        className={`form-control ${addErrors.block_name ? "is-invalid" : ""}`}
                                        style={{ padding: "9px 12px", borderRadius: "8px", borderColor: "#cbd5e1", fontSize: "0.9rem" }}
                                    />
                                    {addErrors.block_name && (
                                        <div className="invalid-feedback">{addErrors.block_name}</div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold text-dark small mb-1">
                                        Total Flat Capacity <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        placeholder="e.g. 10"
                                        value={addForm.flat_count}
                                        onChange={(e) => {
                                            setAddForm(prev => ({ ...prev, flat_count: e.target.value }));
                                            if (addErrors.flat_count) setAddErrors(prev => ({ ...prev, flat_count: "" }));
                                        }}
                                        className={`form-control ${addErrors.flat_count ? "is-invalid" : ""}`}
                                        style={{ padding: "9px 12px", borderRadius: "8px", borderColor: "#cbd5e1", fontSize: "0.9rem" }}
                                    />
                                    {addErrors.flat_count && (
                                        <div className="invalid-feedback">{addErrors.flat_count}</div>
                                    )}
                                    <small className="text-muted d-block mt-1" style={{ fontSize: "0.75rem" }}>
                                        Number of planned residential apartments for this block
                                    </small>
                                </div>

                                <div className="d-flex justify-content-end gap-2 pt-3 border-top mt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddModalOpen(false)}
                                        className="btn btn-sm btn-outline-secondary px-3"
                                        style={{ borderRadius: "8px", fontWeight: "500" }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={addLoading}
                                        className="btn btn-sm btn-primary px-3"
                                        style={{ borderRadius: "8px", background: "#2563eb", borderColor: "#2563eb", fontWeight: "600" }}
                                    >
                                        {addLoading ? "Creating..." : "Create Block"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 6. Edit Block Modal (Non-blinking Direct Motion Component) */}
            <AnimatePresence>
                {editingBlock && (
                    <motion.div
                        key="edit-block-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        onClick={(e) => {
                            if (e.target === e.currentTarget) setEditingBlock(null);
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
                        <motion.div
                            key="edit-block-dialog"
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: 10 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                position: "relative",
                                width: "100%",
                                maxWidth: "500px",
                                background: "#ffffff",
                                borderRadius: "12px",
                                border: "1px solid #e2e8f0",
                                boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.25)",
                                overflow: "hidden",
                                zIndex: 1
                            }}
                        >
                            {/* Modal Header */}
                            <div className="p-3 px-4 border-bottom d-flex align-items-center justify-content-between bg-white">
                                <div>
                                    <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: "1.05rem" }}>
                                        Edit Housing Block
                                    </h6>
                                    <small className="text-secondary">Update details for Block #{editingBlock.id}</small>
                                </div>
                                <button
                                    onClick={() => setEditingBlock(null)}
                                    className="btn btn-sm text-secondary p-0 border-0"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Modal Form */}
                            <form onSubmit={handleEditSubmit} className="p-4">
                                <div className="mb-3">
                                    <label className="form-label fw-semibold text-dark small mb-1">
                                        Block / Tower Name <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.block_name}
                                        onChange={(e) => {
                                            setEditForm(prev => ({ ...prev, block_name: e.target.value }));
                                            if (editErrors.block_name) setEditErrors(prev => ({ ...prev, block_name: "" }));
                                        }}
                                        className={`form-control ${editErrors.block_name ? "is-invalid" : ""}`}
                                        style={{ padding: "9px 12px", borderRadius: "8px", borderColor: "#cbd5e1", fontSize: "0.9rem" }}
                                    />
                                    {editErrors.block_name && (
                                        <div className="invalid-feedback">{editErrors.block_name}</div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold text-dark small mb-1">
                                        Total Flat Capacity <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={editForm.flat_count}
                                        onChange={(e) => {
                                            setEditForm(prev => ({ ...prev, flat_count: e.target.value }));
                                            if (editErrors.flat_count) setEditErrors(prev => ({ ...prev, flat_count: "" }));
                                        }}
                                        className={`form-control ${editErrors.flat_count ? "is-invalid" : ""}`}
                                        style={{ padding: "9px 12px", borderRadius: "8px", borderColor: "#cbd5e1", fontSize: "0.9rem" }}
                                    />
                                    {editErrors.flat_count && (
                                        <div className="invalid-feedback">{editErrors.flat_count}</div>
                                    )}
                                </div>

                                <div className="d-flex justify-content-end gap-2 pt-3 border-top mt-4">
                                    <button
                                        type="button"
                                        onClick={() => setEditingBlock(null)}
                                        className="btn btn-sm btn-outline-secondary px-3"
                                        style={{ borderRadius: "8px", fontWeight: "500" }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={editLoading}
                                        className="btn btn-sm btn-primary px-3"
                                        style={{ borderRadius: "8px", background: "#2563eb", borderColor: "#2563eb", fontWeight: "600" }}
                                    >
                                        {editLoading ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default HousingBlockPage;
