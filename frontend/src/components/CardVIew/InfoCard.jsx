import React from "react";
import SparklineChart from "../Charts/SparklineChart";

function InfoCard({
  title,
  count,
  change,
  changeColor = "success",
  icon = "bi-person",
  period,
  iconBg = "primary",
    chartData = [],
}) {

  return (
    <div
      className="card border-0 shadow-sm position-relative"
      style={{
        borderRadius: "16px",
        background: "linear-gradient(135deg, #ffffff, #f3f9ff)",
       overflow: "hidden",
        minHeight: "150px",

      }}
    >
      <div className="card-body">

        {/* Icon + Stats */}
        <div className="d-flex justify-content-between">
          <span
            className={`d-flex align-items-center justify-content-center rounded-circle `}
            style={{
              width: "42px",
              height: "42px",
              background:
                iconBg === "info"
                  ? "linear-gradient(135deg, #00c6ff, #0072ff)"
                  : iconBg === "primary"
                  ? "linear-gradient(135deg, #4e54c8, #8f94fb)"
                  : "#0d6efd",
              color: "white",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            <i className={`bi ${icon} fs-5`}></i>
          </span>

          <div className="text-end">
            {change && (
              <span className={`badge bg-${changeColor} px-2 py-1 fw-medium mb-1`}>
                {change}
              </span>
            )}
            <p className="mb-0 small text-muted fw-bold">{period} </p>
          </div>
        </div>

        {/* Title + Count */}
        <div className="text-center mb-4">
          <p className="mb-1 text-muted">{title}</p>
          <h3 className="fw-bold">{count}</h3>
        </div>

         {/* Sparkline Bottom Right */}
        <div style={{ position: "absolute", bottom: "12px", right: "12px", width: "80px", height: "54px" }}>
          <SparklineChart data={chartData} />
        </div>

      </div>
    </div>
  );
}

export default InfoCard;
