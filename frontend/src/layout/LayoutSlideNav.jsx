import React from "react";
import SlideNav from "../components/dashboard/SlideNav/SlideNav";
import { Bell, Search, ShieldCheck } from "react-bootstrap-icons";

export default function LayoutSlideNav({ children, role }) {
  const adminEmail = localStorage.getItem("memberId") || "admin@system.com";

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#f8fafc" }}>
      {/* Sidebar Navigation */}
      <SlideNav role={role} />

      {/* Main Container */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden" }}>
        {/* Top Navbar */}
        <header
          style={{
            height: "68px",
            background: "#ffffff",
            borderBottom: "1px solid rgba(226, 232, 240, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 28px",
            flexShrink: 0,
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.02)"
          }}
        >
          {/* Left search & society badge */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "#f1f5f9",
                padding: "8px 14px",
                borderRadius: "10px",
                width: "280px",
                border: "1px solid #e2e8f0"
              }}
            >
              <Search size={14} color="#64748b" />
              <input
                type="text"
                placeholder="Search flats, residents, notices..."
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  fontSize: "0.85rem",
                  color: "#1e293b",
                  width: "100%"
                }}
              />
            </div>

            <div className="status-pill success d-none d-md-flex">
              <span className="pulse-dot" style={{ background: "#10b981" }}></span>
              <span>System Live</span>
            </div>
          </div>

          {/* Right actions & user profile */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "38px",
                height: "38px",
                borderRadius: "10px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#475569",
                position: "relative"
              }}
              title="Notifications"
            >
              <Bell size={16} />
              <span
                style={{
                  position: "absolute",
                  top: "7px",
                  right: "7px",
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: "#ef4444"
                }}
              ></span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "4px 8px 4px 4px",
                borderRadius: "30px",
                background: "#f8fafc",
                border: "1px solid #e2e8f0"
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "700",
                  fontSize: "0.82rem"
                }}
              >
                A
              </div>
              <div style={{ paddingRight: "8px" }} className="d-none d-sm-block">
                <div style={{ fontSize: "0.82rem", fontWeight: "700", color: "#0f172a", lineHeight: 1.2 }}>
                  System Administrator
                </div>
                <div style={{ fontSize: "0.7rem", color: "#64748b" }}>
                  {adminEmail}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main style={{ flex: 1, padding: "28px", overflowY: "auto", background: "#f8fafc" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
