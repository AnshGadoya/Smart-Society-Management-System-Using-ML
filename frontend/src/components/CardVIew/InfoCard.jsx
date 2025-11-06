import React from "react";

function InfoCard({
                      title,
                      count,
                      change,
                      changeColor = "success", // default color
                      icon,
                      period,
                      bgImage = "assets/img/bg/bg-01.svg",
                      iconBg = "primary", // default icon background color
                  }) {
    const bgShapeStyle = {
        width: "100px",
        opacity: 0.1,
    };

    const iconStyle = {
        width: "40px",
        height: "40px",
    };

    const chartPlaceholderStyle = {
        width: "80px",
        height: "54px",
        background: "rgba(0,0,0,0.05)",
        borderRadius: "4px",
    };

    return (
        <div className="card position-relative border rounded-2 shadow-sm">
            {/* Background shape */}
            <img
                src={bgImage}
                alt="bg"
                className="position-absolute start-0 top-0"
                style={bgShapeStyle}
            />

            <div className="card-body">
                {/* Icon + Change Badge */}
                <div className="d-flex align-items-center justify-content-between mb-2">
          <span
              className={`avatar bg-${iconBg} rounded-circle d-flex align-items-center justify-content-center`}
              style={iconStyle}
          >
            <i className={`bi ${icon} fs-5 text-white`}></i>
          </span>
                    <div className="text-end">
            <span
                className={`badge bg-${changeColor} px-2 py-1 fw-medium mb-1`}
            >
              {change}
            </span>
                        <p className="mb-0 small text-muted">{period}</p>
                    </div>
                </div>

                {/* Title + Count + Placeholder Chart */}
                <div className="d-flex align-items-center justify-content-between">
                    <div>
                        <p className="mb-1">{title}</p>
                        <h3 className="fw-bold mb-0">{count}</h3>
                    </div>
                    <div style={chartPlaceholderStyle}></div>
                </div>
            </div>
        </div>
    );
}

export default InfoCard;
