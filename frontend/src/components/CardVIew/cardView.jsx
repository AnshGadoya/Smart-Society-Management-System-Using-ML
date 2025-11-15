import React from "react";

function CardView({ click = "#", title = "Title", description = "Description", Icon }) {
  return (
    <a href={click} className="text-decoration-none" style={{ color: "inherit" }}>
      <div
        className="card shadow-sm border-0 h-100"
        style={{
          borderRadius: "18px",
          padding: "22px",
          background: "linear-gradient(145deg, #f7faff, #eef2f7)",
          transition: "all 0.25s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-6px)";
          e.currentTarget.style.boxShadow = "0 12px 25px rgba(0,0,0,0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0px)";
          e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
        }}
      >
        <div className="d-flex align-items-start gap-3">

          {/* ICON BOX (Premium Rounded Box) */}
          {Icon && (
            <div
              style={{
                background: "#fff",
                padding: "10px",
                borderRadius: "14px",
                boxShadow: "0 3px 8px rgba(0,0,0,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "50px",
                minHeight: "50px",
              }}
            >
              <Icon size={28} color="#007bff" />
            </div>
          )}

          {/* TEXT */}
          <div>
            <h5 className="fw-semibold mb-1">{title}</h5>
            <p className="text-muted mb-0 small">{description}</p>
          </div>

        </div>
      </div>
    </a>
  );
}

export default CardView;
