import React from "react";
import PropTypes from 'prop-types';

function StatsCard({
                       title,
                       value,
                       icon,
                       trendPercentage,
                       trendText,
                       trendPositive = true,
                       bgColor = 'primary',
                       iconBgColor = 'primary',
                       iconTextColor = 'white'
                   }) {


    return (<>

        <div className="card shadow-sm flex-fill w-100">
            <div className="card-body">

                <div className="d-flex align-items-center justify-content-between mb-2">
                    <div>
                        <p className="mb-1 text-truncate">{title}</p>
                        <h6 className="mb-2 fw-bold">{value}</h6>
                    </div>

                    <span
                        className={`d-inline-flex align-items-center justify-content-center rounded-circle bg-${iconTextColor} text-${iconBgColor}  border border-${bgColor} flex-shrink-0`}
                        style={{width: " 48px", height: "48px"}}>
                            <i className={`bi bi-arrow-${trendPositive ? 'up' : 'down'}-right-circle fs-4`}></i>
                        </span>
                </div>


                <div className="p-2 rounded bg-light text-center">
                    <p className="mb-0 small">
                          <span className={`text-${trendPositive ? 'success' : 'danger'}`}>
                <i className={`bi bi-arrow-${trendPositive ? 'up' : 'down'}-right me-1`}></i>{trendPercentage}%
                          </span>
                        {trendText}
                    </p>
                </div>
            </div>
        </div>
    </>)


}

StatsCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
    trendPercentage: PropTypes.number.isRequired,
    trendPositive: PropTypes.bool,
    iconBgColor: PropTypes.string,
    iconTextColor: PropTypes.string,
    iconBorderColor: PropTypes.string,
};

StatsCard.defaultProps = {
    trendPositive: true,
};

export default StatsCard;