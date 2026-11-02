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
    Check2Circle,
    Sliders
} from "react-bootstrap-icons";
import { housingApi, blockApi } from "../../services/api";
import { unitTypes } from "../../utils/constants/appConstants";

function HousingView() {
    const [housingData, setHousingData] = useState([]);
    const [blocks, setBlocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Filters and search
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedBlockFilter, setSelectedBlockFilter] = useState("all");
    const [selectedTypeFilter, setSelectedTypeFilter] = useState("all");
    const [viewMode, setViewMode] = useState("cards"); // 'cards' or 'table'

    // Modals
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingUnit, setEditingUnit] = useState(null);
    const [alertMessage, setAlertMessage] = useState(null);

    // Add Form State (Supports adding multiple units or single)
    const [addBlockId, setAddBlockId] = useState("");
    const [addRows, setAddRows] = useState([{ unit_number: "", type: unitTypes[1] || "2BHK" }]);
    const [addErrors, setAddErrors] = useState({});
    const [addLoading, setAddLoading] = useState(false);

    // Edit Form State
    const [editForm, setEditForm] = useState({ block_id: "", unit_number: "", type: "2BHK" });
    const [editErrors, setEditErrors] = useState({});
    const [editLoading, setEditLoading] = useState(false);

    useEffect(() => {
        loadAllData();
    }, []);

    const loadAllData = async () => {
        setRefreshing(true);
        try {
            const [blocksRes, housingRes] = await Promise.allSettled([
                blockApi.getBlocks(),
                housingApi.getHousing()
            ]);

            if (blocksRes.status === "fulfilled") setBlocks(blocksRes.value || []);
            if (housingRes.status === "fulfilled") setHousingData(housingRes.value || []);
        } catch (error) {
            console.error("Error loading housing data:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Calculate block remaining capacity
    const getBlockCapacityInfo = (blockId) => {
        const blk = blocks.find(b => String(b.id) === String(blockId));
        if (!blk) return { total: 0, used: 0, remaining: 0 };
        const used = housingData.filter(u => String(u.block_id) === String(blockId)).length;
        const total = parseInt(blk.flat_count, 10) || 0;
        return { total, used, remaining: Math.max(0, total - used) };
    };

    // Computations for KPI overview
    const totalUnits = housingData.length;
    const totalPlannedCapacity = blocks.reduce((acc, b) => acc + (parseInt(b.flat_count) || 0), 0);
    const occupancyPercent = totalPlannedCapacity > 0 ? Math.round((totalUnits / totalPlannedCapacity) * 100) : 0;

    // Type distribution
    const typeCounts = housingData.reduce((acc, u) => {
        const t = u.type || "Other";
        acc[t] = (acc[t] || 0) + 1;
        return acc;
    }, {});
    const topType = Object.keys(typeCounts).sort((a, b) => typeCounts[b] - typeCounts[a])[0] || "2BHK";

    // Filter computation
    const filteredUnits = housingData.filter(u => {
        const matchBlock = selectedBlockFilter === "all" || String(u.block_id) === String(selectedBlockFilter);
        const matchType = selectedTypeFilter === "all" || (u.type || "").toLowerCase() === selectedTypeFilter.toLowerCase();
        const q = searchQuery.toLowerCase().trim();
        const matchSearch = !q ||
            (u.unit_number && u.unit_number.toLowerCase().includes(q)) ||
            (u.block_name && u.block_name.toLowerCase().includes(q)) ||
            (u.type && u.type.toLowerCase().includes(q)) ||
            (u.id && String(u.id).includes(q));

        return matchBlock && matchType && matchSearch;
    });

    // Delete handler
    const handleDeleteUnit = async (unitId, unitNumber, e) => {
        if (e) e.stopPropagation();
        if (!window.confirm(`Are you sure you want to delete Unit "${unitNumber}" (ID: ${unitId})?`)) return;

        try {
            await housingApi.deleteHousing(unitId);
            setHousingData(prev => prev.filter(u => u.id !== unitId));
            setAlertMessage({ type: "success", text: `Unit ${unitNumber} successfully removed.` });
            setTimeout(() => setAlertMessage(null), 3000);
        } catch (error) {
            console.error("Delete unit error:", error);
            setAlertMessage({ type: "danger", text: "Failed to delete unit. Please try again." });
            setTimeout(() => setAlertMessage(null), 3500);
        }
    };

    // Open Add Modal
    const handleOpenAddModal = () => {
        setAddBlockId(blocks.length > 0 ? String(blocks[0].id) : "");
        setAddRows([{ unit_number: "", type: unitTypes[1] || "2BHK" }]);
        setAddErrors({});
        setIsAddModalOpen(true);
    };

    const handleAddRow = () => {
        setAddRows(prev => [...prev, { unit_number: "", type: unitTypes[1] || "2BHK" }]);
    };

    const handleRemoveRow = (index) => {
        if (addRows.length > 1) {
            setAddRows(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        if (!addBlockId) {
            setAddErrors({ block: "Please select a block for the units" });
            return;
        }

        const emptyUnits = addRows.some(r => !r.unit_number.trim());
        if (emptyUnits) {
            setAddErrors({ units: "Please provide a unit number for all rows" });
            return;
        }

        setAddLoading(true);
        try {
            const payload = addRows.map(r => ({
                block_id: parseInt(addBlockId, 10),
                unit_number: r.unit_number.trim(),
                type: r.type
            }));

            await housingApi.addHousing(payload);
            setAlertMessage({ type: "success", text: `${payload.length} housing unit(s) registered successfully!` });
            setTimeout(() => setAlertMessage(null), 3500);
            setIsAddModalOpen(false);
            loadAllData();
        } catch (error) {
            console.error("Add housing units error:", error);
            setAlertMessage({ type: "danger", text: "Failed to add housing units. Please verify block capacity." });
            setTimeout(() => setAlertMessage(null), 3500);
        } finally {
            setAddLoading(false);
        }
    };

    // Open Edit Modal
    const handleOpenEdit = (unit, e) => {
        if (e) e.stopPropagation();
        setEditingUnit(unit);
        setEditForm({
            block_id: String(unit.block_id || (blocks[0] && blocks[0].id) || ""),
            unit_number: unit.unit_number || "",
            type: unit.type || "2BHK"
        });
        setEditErrors({});
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!editingUnit) return;

        if (!editForm.unit_number.trim()) {
            setEditErrors({ unit_number: "Unit Number is required" });
            return;
        }

        setEditLoading(true);
        try {
            await housingApi.updateHousing(editingUnit.id, {
                id: editingUnit.id,
                block_id: parseInt(editForm.block_id, 10),
                unit_number: editForm.unit_number.trim(),
                type: editForm.type
            });

            setAlertMessage({ type: "success", text: `Unit ${editForm.unit_number} updated successfully.` });
            setTimeout(() => setAlertMessage(null), 3000);
            setEditingUnit(null);
            loadAllData();
        } catch (error) {
            console.error("Error updating unit:", error);
            setAlertMessage({ type: "danger", text: "Failed to update unit." });
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
                        Housing Units Directory
                    </h3>
                    <p className="text-secondary small mb-0">
                        Manage registered flats, floor typologies, and residential block assignments
                    </p>
                </div>

                <div className="d-flex align-items-center gap-2">
                    <button
                        onClick={loadAllData}
                        className="btn btn-sm btn-outline-secondary d-inline-flex align-items-center gap-2"
                        disabled={refreshing}
                        style={{ borderRadius: "8px", padding: "7px 14px", fontWeight: "500" }}
                    >
                        <ArrowRepeat size={14} className={refreshing ? "spin-animation" : ""} />
                        <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
                    </button>

                    <button
                        onClick={handleOpenAddModal}
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
                        <span>Add Flat / Unit</span>
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

            {/* 2. Overview KPI Metric Cards */}
            <div className="row g-3 mb-4">
                {/* Metric 1: Total Registered Units */}
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
                            <span className="status-pill success">Configured</span>
                        </div>
                        <div className="text-secondary fw-semibold mb-1" style={{ fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                            Registered Flats
                        </div>
                        <div className="fw-bold mb-2 text-dark" style={{ fontSize: "1.85rem", lineHeight: 1.2 }}>
                            {totalUnits}
                        </div>
                        <div className="d-flex align-items-center gap-1 small text-secondary" style={{ fontSize: "0.8rem" }}>
                            <CheckCircleFill size={12} color="#16a34a" />
                            <span>Active in society records</span>
                        </div>
                    </div>
                </div>

                {/* Metric 2: Blocks Covered */}
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
                            <span className="status-pill neutral">{blocks.length} Blocks</span>
                        </div>
                        <div className="text-secondary fw-semibold mb-1" style={{ fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                            Blocks Utilized
                        </div>
                        <div className="fw-bold mb-2 text-dark" style={{ fontSize: "1.85rem", lineHeight: 1.2 }}>
                            {new Set(housingData.map(u => u.block_id)).size} / {blocks.length}
                        </div>
                        <div className="small text-secondary" style={{ fontSize: "0.8rem" }}>
                            <span>Towers with registered units</span>
                        </div>
                    </div>
                </div>

                {/* Metric 3: Common Typology */}
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
                            <span className="status-pill neutral">Top Type</span>
                        </div>
                        <div className="text-secondary fw-semibold mb-1" style={{ fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                            Dominant Typology
                        </div>
                        <div className="fw-bold mb-2 text-dark" style={{ fontSize: "1.85rem", lineHeight: 1.2 }}>
                            {topType}
                        </div>
                        <div className="small text-secondary" style={{ fontSize: "0.8rem" }}>
                            <span>{typeCounts[topType] || 0} units registered as {topType}</span>
                        </div>
                    </div>
                </div>

                {/* Metric 4: Capacity Configured */}
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
                            <span className="status-pill neutral">{occupancyPercent}% Configured</span>
                        </div>
                        <div className="text-secondary fw-semibold mb-1" style={{ fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                            Allocation Rate
                        </div>
                        <div className="fw-bold mb-2 text-dark" style={{ fontSize: "1.85rem", lineHeight: 1.2 }}>
                            {totalUnits} of {totalPlannedCapacity}
                        </div>
                        <div className="progress mt-2" style={{ height: "5px", borderRadius: "3px", background: "#f1f5f9" }}>
                            <div
                                className="progress-bar"
                                style={{ width: `${occupancyPercent}%`, background: "#2563eb", borderRadius: "3px" }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Controls Bar: Search, Block Filter, Typology Filter, and View Mode */}
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
                        width: "260px"
                    }}
                >
                    <Search size={14} color="#64748b" />
                    <input
                        type="text"
                        placeholder="Search unit, block, type..."
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

                {/* Filters Group */}
                <div className="d-flex flex-wrap align-items-center gap-2">
                    {/* Block Filter Dropdown */}
                    <div className="d-flex align-items-center gap-1">
                        <span className="small text-secondary" style={{ fontSize: "0.78rem" }}>Block:</span>
                        <select
                            value={selectedBlockFilter}
                            onChange={(e) => setSelectedBlockFilter(e.target.value)}
                            style={{
                                padding: "4px 10px",
                                borderRadius: "6px",
                                border: "1px solid #e2e8f0",
                                background: "#f8fafc",
                                fontSize: "0.8rem",
                                color: "#334155",
                                outline: "none"
                            }}
                        >
                            <option value="all">All Blocks</option>
                            {blocks.map(b => (
                                <option key={b.id} value={String(b.id)}>
                                    Block {b.block_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Typology Filter Dropdown */}
                    <div className="d-flex align-items-center gap-1">
                        <span className="small text-secondary" style={{ fontSize: "0.78rem" }}>Type:</span>
                        <select
                            value={selectedTypeFilter}
                            onChange={(e) => setSelectedTypeFilter(e.target.value)}
                            style={{
                                padding: "4px 10px",
                                borderRadius: "6px",
                                border: "1px solid #e2e8f0",
                                background: "#f8fafc",
                                fontSize: "0.8rem",
                                color: "#334155",
                                outline: "none"
                            }}
                        >
                            <option value="all">All Types</option>
                            {unitTypes.map(t => (
                                <option key={t} value={t}>
                                    {t}
                                </option>
                            ))}
                        </select>
                    </div>
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
                        title="Flat Cards View"
                    >
                        <Grid size={13} />
                        <span>Flat Cards</span>
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
                    <p className="text-muted small mt-2">Loading housing units...</p>
                </div>
            ) : filteredUnits.length === 0 ? (
                <div className="text-center py-5 bg-white rounded-3 border" style={{ borderColor: "#e2e8f0" }}>
                    <HouseDoor size={36} color="#94a3b8" className="mb-2" />
                    <h6 className="fw-bold text-dark mb-1">No Housing Units Found</h6>
                    <p className="text-muted small mb-3">No units match your search query or selected filters.</p>
                    <button
                        onClick={handleOpenAddModal}
                        className="btn btn-sm btn-primary"
                        style={{ borderRadius: "6px", background: "#2563eb", borderColor: "#2563eb" }}
                    >
                        Add First Flat
                    </button>
                </div>
            ) : viewMode === "cards" ? (
                /* === RESIDENTIAL FLAT CARDS VIEW === */
                <div className="row g-3">
                    {filteredUnits.map((unit) => {
                        const block = blocks.find(b => String(b.id) === String(unit.block_id));
                        const blockName = unit.block_name || (block ? block.block_name : `Block #${unit.block_id}`);

                        return (
                            <div key={unit.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
                                <div
                                    className="bg-white p-3 h-100 rounded-3 border d-flex flex-column justify-content-between"
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
                                        {/* Card Top: Unit Badge & Typology Tag */}
                                        <div className="d-flex align-items-center justify-content-between mb-2">
                                            <span
                                                style={{
                                                    fontSize: "0.72rem",
                                                    fontWeight: "600",
                                                    color: "#475569",
                                                    background: "#f1f5f9",
                                                    border: "1px solid #e2e8f0",
                                                    padding: "2px 7px",
                                                    borderRadius: "4px"
                                                }}
                                            >
                                                #UNIT-{unit.id}
                                            </span>

                                            <span
                                                style={{
                                                    fontSize: "0.72rem",
                                                    fontWeight: "700",
                                                    color: "#1d4ed8",
                                                    background: "#eff6ff",
                                                    border: "1px solid #bfdbfe",
                                                    padding: "2px 8px",
                                                    borderRadius: "4px"
                                                }}
                                            >
                                                {unit.type || "Flat"}
                                            </span>
                                        </div>

                                        {/* Unit Number Heading */}
                                        <div className="d-flex align-items-baseline gap-2 mb-2">
                                            <h5 className="fw-bold mb-0 text-dark" style={{ letterSpacing: "-0.01em" }}>
                                                Flat {unit.unit_number}
                                            </h5>
                                        </div>

                                        {/* Block Allocation */}
                                        <div className="p-2 mb-2 rounded bg-light border" style={{ borderColor: "#f1f5f9" }}>
                                            <div className="d-flex align-items-center gap-2">
                                                <BuildingsFill size={14} color="#2563eb" />
                                                <span className="small fw-semibold text-dark">
                                                    Block {blockName}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="d-flex align-items-center justify-content-between pt-2 border-top mt-2">
                                        <button
                                            onClick={(e) => handleOpenEdit(unit, e)}
                                            className="btn btn-sm text-primary p-0 border-0 fw-semibold d-inline-flex align-items-center gap-1"
                                            style={{ fontSize: "0.78rem" }}
                                        >
                                            <PencilSquare size={13} />
                                            <span>Edit</span>
                                        </button>

                                        <button
                                            onClick={(e) => handleDeleteUnit(unit.id, unit.unit_number, e)}
                                            className="btn btn-sm text-secondary p-0 border-0"
                                            title="Delete Unit"
                                            style={{ opacity: 0.65 }}
                                            onMouseEnter={(e) => { e.currentTarget.style.opacity = 1; e.currentTarget.style.color = "#dc2626"; }}
                                            onMouseLeave={(e) => { e.currentTarget.style.opacity = 0.65; e.currentTarget.style.color = ""; }}
                                        >
                                            <Trash size={14} />
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
                                    <th className="ps-3 py-3 fw-semibold">Unit ID</th>
                                    <th className="py-3 fw-semibold">Block / Tower</th>
                                    <th className="py-3 fw-semibold">Unit Number</th>
                                    <th className="py-3 fw-semibold">Typology</th>
                                    <th className="py-3 fw-semibold">Status</th>
                                    <th className="pe-3 text-end py-3 fw-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUnits.map((unit) => {
                                    const block = blocks.find(b => String(b.id) === String(unit.block_id));
                                    const blockName = unit.block_name || (block ? block.block_name : `Block #${unit.block_id}`);

                                    return (
                                        <tr key={unit.id}>
                                            <td className="ps-3">
                                                <span
                                                    style={{
                                                        fontSize: "0.74rem",
                                                        fontWeight: "600",
                                                        color: "#475569",
                                                        background: "#f1f5f9",
                                                        border: "1px solid #e2e8f0",
                                                        padding: "2px 7px",
                                                        borderRadius: "4px"
                                                    }}
                                                >
                                                    #UNIT-{unit.id}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="d-flex align-items-center gap-2">
                                                    <span
                                                        style={{
                                                            width: "26px",
                                                            height: "26px",
                                                            borderRadius: "6px",
                                                            background: "#eff6ff",
                                                            color: "#1d4ed8",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            fontWeight: "700",
                                                            fontSize: "0.78rem"
                                                        }}
                                                    >
                                                        {blockName.charAt(0).toUpperCase()}
                                                    </span>
                                                    <span className="fw-semibold text-dark">
                                                        Block {blockName}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>
                                                <strong style={{ color: "#0f172a" }}>Flat {unit.unit_number}</strong>
                                            </td>
                                            <td>
                                                <span
                                                    style={{
                                                        fontSize: "0.74rem",
                                                        fontWeight: "600",
                                                        color: "#1d4ed8",
                                                        background: "#eff6ff",
                                                        border: "1px solid #bfdbfe",
                                                        padding: "2px 8px",
                                                        borderRadius: "4px"
                                                    }}
                                                >
                                                    {unit.type || "Standard"}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="status-pill success py-0 px-2" style={{ fontSize: "0.72rem" }}>
                                                    Active Unit
                                                </span>
                                            </td>
                                            <td className="pe-3 text-end">
                                                <button
                                                    onClick={(e) => handleOpenEdit(unit, e)}
                                                    className="btn btn-sm btn-outline-primary me-2"
                                                    style={{ borderRadius: "6px", fontSize: "0.78rem", padding: "4px 10px" }}
                                                >
                                                    <PencilSquare size={13} className="me-1" />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={(e) => handleDeleteUnit(unit.id, unit.unit_number, e)}
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

            {/* 5. Add Unit Modal Dialog (Flicker-Free Direct Motion Component) */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <motion.div
                        key="add-unit-overlay"
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
                            key="add-unit-dialog"
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: 10 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                position: "relative",
                                width: "100%",
                                maxWidth: "560px",
                                maxHeight: "90vh",
                                background: "#ffffff",
                                borderRadius: "12px",
                                border: "1px solid #e2e8f0",
                                boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.25)",
                                overflow: "hidden",
                                display: "flex",
                                flexDirection: "column",
                                zIndex: 1
                            }}
                        >
                            {/* Header */}
                            <div className="p-3 px-4 border-bottom d-flex align-items-center justify-content-between bg-white">
                                <div>
                                    <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: "1.05rem" }}>
                                        Register Housing Flats
                                    </h6>
                                    <small className="text-secondary">Add residential units to a society block</small>
                                </div>
                                <button
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="btn btn-sm text-secondary p-0 border-0"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Form Body */}
                            <form onSubmit={handleAddSubmit} style={{ overflowY: "auto", padding: "20px 24px", flex: 1 }}>
                                {/* Target Block */}
                                <div className="mb-3">
                                    <label className="form-label fw-semibold text-dark small mb-1">
                                        Select Target Block <span className="text-danger">*</span>
                                    </label>
                                    <select
                                        className="form-select"
                                        value={addBlockId}
                                        onChange={(e) => {
                                            setAddBlockId(e.target.value);
                                            if (addErrors.block) setAddErrors(prev => ({ ...prev, block: "" }));
                                        }}
                                        style={{ padding: "9px 12px", borderRadius: "8px", borderColor: "#cbd5e1", fontSize: "0.9rem" }}
                                        required
                                    >
                                        <option value="">Select Block</option>
                                        {blocks.map((b) => {
                                            const cap = getBlockCapacityInfo(b.id);
                                            return (
                                                <option key={b.id} value={b.id}>
                                                    Block {b.block_name} ({cap.used}/{cap.total} flats allocated - {cap.remaining} slots remaining)
                                                </option>
                                            );
                                        })}
                                    </select>
                                    {addErrors.block && (
                                        <div className="text-danger small mt-1">{addErrors.block}</div>
                                    )}
                                </div>

                                {/* Units Rows List */}
                                <div className="mb-2">
                                    <div className="d-flex align-items-center justify-content-between mb-2">
                                        <label className="form-label fw-semibold text-dark small mb-0">
                                            Flat Details <span className="text-danger">*</span>
                                        </label>
                                        <button
                                            type="button"
                                            onClick={handleAddRow}
                                            className="btn btn-sm btn-link text-primary p-0 text-decoration-none fw-semibold"
                                            style={{ fontSize: "0.8rem" }}
                                        >
                                            + Add Another Flat
                                        </button>
                                    </div>

                                    {addRows.map((row, index) => (
                                        <div key={index} className="row g-2 mb-2 align-items-center">
                                            <div className="col-6">
                                                <input
                                                    type="text"
                                                    placeholder={`Flat No (e.g. ${101 + index})`}
                                                    value={row.unit_number}
                                                    onChange={(e) => {
                                                        const updated = [...addRows];
                                                        updated[index].unit_number = e.target.value;
                                                        setAddRows(updated);
                                                        if (addErrors.units) setAddErrors(prev => ({ ...prev, units: "" }));
                                                    }}
                                                    className="form-control"
                                                    style={{ padding: "8px 12px", borderRadius: "8px", borderColor: "#cbd5e1", fontSize: "0.88rem" }}
                                                    required
                                                />
                                            </div>
                                            <div className="col-4">
                                                <select
                                                    value={row.type}
                                                    onChange={(e) => {
                                                        const updated = [...addRows];
                                                        updated[index].type = e.target.value;
                                                        setAddRows(updated);
                                                    }}
                                                    className="form-select"
                                                    style={{ padding: "8px 10px", borderRadius: "8px", borderColor: "#cbd5e1", fontSize: "0.88rem" }}
                                                >
                                                    {unitTypes.map(t => (
                                                        <option key={t} value={t}>{t}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="col-2 text-end">
                                                {addRows.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveRow(index)}
                                                        className="btn btn-sm text-danger p-1"
                                                        title="Remove Row"
                                                    >
                                                        <Trash size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {addErrors.units && (
                                        <div className="text-danger small mt-1">{addErrors.units}</div>
                                    )}
                                </div>
                            </form>

                            {/* Footer */}
                            <div className="p-3 px-4 border-top bg-light d-flex justify-content-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="btn btn-sm btn-outline-secondary px-3"
                                    style={{ borderRadius: "8px", fontWeight: "500" }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleAddSubmit}
                                    disabled={addLoading}
                                    className="btn btn-sm btn-primary px-3"
                                    style={{ borderRadius: "8px", background: "#2563eb", borderColor: "#2563eb", fontWeight: "600" }}
                                >
                                    {addLoading ? "Saving..." : `Register ${addRows.length} Unit(s)`}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 6. Edit Unit Modal Dialog (Flicker-Free Direct Motion Component) */}
            <AnimatePresence>
                {editingUnit && (
                    <motion.div
                        key="edit-unit-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        onClick={(e) => {
                            if (e.target === e.currentTarget) setEditingUnit(null);
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
                            key="edit-unit-dialog"
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
                            {/* Header */}
                            <div className="p-3 px-4 border-bottom d-flex align-items-center justify-content-between bg-white">
                                <div>
                                    <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: "1.05rem" }}>
                                        Edit Housing Unit
                                    </h6>
                                    <small className="text-secondary">Update details for Unit #{editingUnit.id}</small>
                                </div>
                                <button
                                    onClick={() => setEditingUnit(null)}
                                    className="btn btn-sm text-secondary p-0 border-0"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleEditSubmit} className="p-4">
                                <div className="mb-3">
                                    <label className="form-label fw-semibold text-dark small mb-1">
                                        Block / Tower Assignment <span className="text-danger">*</span>
                                    </label>
                                    <select
                                        className="form-select"
                                        value={editForm.block_id}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, block_id: e.target.value }))}
                                        style={{ padding: "9px 12px", borderRadius: "8px", borderColor: "#cbd5e1", fontSize: "0.9rem" }}
                                        required
                                    >
                                        {blocks.map(b => (
                                            <option key={b.id} value={String(b.id)}>
                                                Block {b.block_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold text-dark small mb-1">
                                        Flat / Unit Number <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.unit_number}
                                        onChange={(e) => {
                                            setEditForm(prev => ({ ...prev, unit_number: e.target.value }));
                                            if (editErrors.unit_number) setEditErrors(prev => ({ ...prev, unit_number: "" }));
                                        }}
                                        className={`form-control ${editErrors.unit_number ? "is-invalid" : ""}`}
                                        style={{ padding: "9px 12px", borderRadius: "8px", borderColor: "#cbd5e1", fontSize: "0.9rem" }}
                                        required
                                    />
                                    {editErrors.unit_number && (
                                        <div className="invalid-feedback">{editErrors.unit_number}</div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-semibold text-dark small mb-1">
                                        Typology <span className="text-danger">*</span>
                                    </label>
                                    <select
                                        className="form-select"
                                        value={editForm.type}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, type: e.target.value }))}
                                        style={{ padding: "9px 12px", borderRadius: "8px", borderColor: "#cbd5e1", fontSize: "0.9rem" }}
                                    >
                                        {unitTypes.map(t => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="d-flex justify-content-end gap-2 pt-3 border-top mt-4">
                                    <button
                                        type="button"
                                        onClick={() => setEditingUnit(null)}
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

export default HousingView;
