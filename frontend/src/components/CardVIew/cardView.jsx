import React from 'react';

function CardView({click = "", title = "text", description = "text"}) {
    return (
        <div className="card m-2" style={{width: "100%", height: "100%"}}>
            <div className="card-body">
                <h5 className="card-title">{title}</h5>
                <p className="card-text">{description}</p>
                <a href={click} className="btn btn-primary">Go somewhere</a>
            </div>
        </div>
    );
}

export default CardView;
