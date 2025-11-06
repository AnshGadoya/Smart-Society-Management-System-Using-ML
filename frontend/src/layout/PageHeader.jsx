import React from "react";

function PageHeader({PageTitle = "Page Titel", PageDescription = ""}) {

    return (<>
        <div className="pb-3 mb-3 mt-3 border-bottom text-start ps-3">
            <h4 className="fw-bold mb-0">{PageTitle}
                {/*<span className="badge bg-primary fs-6 fw-medium ms-2">Total Doctors : 565</span>*/}
            </h4><small className="text-muted">{PageDescription}</small>
        </div>
    </>)
}

export default PageHeader;