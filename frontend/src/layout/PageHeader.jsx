import React from "react";

function PageHeader({
  PageTitle = "Page Title",
  PageDescription = "",
  buttonLabel,        // 👈 label for the button (optional)
  onButtonClick       // 👈 click handler function (optional)
}) {
  return (
    <div className="pb-3 mb-3 mt-3 border-bottom text-start ps-3 d-flex justify-content-between align-items-center">
      <div>
        <h4 className="fw-bold mb-0">{PageTitle}</h4>
        {PageDescription && <small className="text-muted">{PageDescription}</small>}
      </div>

      {buttonLabel && (
        <button className="btn btn-success" onClick={onButtonClick}>
          {buttonLabel}
        </button>
      )}
    </div>
  );
}

export default PageHeader;
