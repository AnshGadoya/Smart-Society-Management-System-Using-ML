import React from "react";


function SummaryCard({
                         title, value, icon, progressValue, trendPercentage, trendPositive, progressBar, iconColor
                     }) {

    // Map icons to React Icons components
    const GetIconComponent = () => {
        switch (icon) {
            case 'units':
                return <i className="bi bi-emoji-sunglasses"></i>;
            case 'residents':

                return <i className={`bi bi-person-bounding-box ${iconColor}`}></i>;
            case 'payments':
                return <i className="bi bi-credit-card-2-back"></i>;
            case 'parking':
                return <i className="bi bi-p-circle-fill"></i>;
            default:
                return <i className="bi bi-people-fill"></i>;
        }
    };

    const trendClass = trendPositive ? 'text-success' : 'text-danger';
    const trendIcon = trendPositive ? 'ti-arrow-up-right' : 'ti-arrow-down-right';

    return (<>
        <div className="card shadow-sm flex-fill w-100">
            <div className="card-body">
                <div className="d-flex justify-content-between mb-2">
                    <div>
                        <p className="mb-1 text-truncate">{title}</p>
                        <h6 className="mb-0 fw-bold">{value}</h6>
                    </div>
                    <span
                        className={`d-inline-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 ${progressBar}`}
                        style={{width: "60px", height: "60px"}}>
       <GetIconComponent/>
</span>


                    {/*</span>*/}
                </div>

                {progressValue !== undefined && (<div className="progress mb-2 progress-sm" style={{height: " 0.5rem"}}>
                    <div
                        className={`progress-bar ${progressBar}`}
                        role="progressbar"
                        style={{width: `${progressValue}%`}}
                        aria-valuenow={progressValue}
                        aria-valuemin="0"
                        aria-valuemax="100"
                    ></div>
                </div>)}

                {trendPercentage !== undefined && (<p className="mb-0 fs-13">
              <span className={trendClass}>
                <i className={`ti ${trendIcon} me-1`}></i>
                  {trendPercentage}%
              </span> from last month
                </p>)}
            </div>
        </div>
    </>)
}


export default SummaryCard