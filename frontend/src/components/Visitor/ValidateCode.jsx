import React, {useState} from "react";

function ValidateCode({visitors}) {
    const [inputCode, setInputCode] = useState("");
    const [result, setResult] = useState(null);

    const handleChange = (e) => {
        setInputCode(e.target.value);
        setResult(null); // reset result on typing
    };

    const handleValidate = (e) => {
        e.preventDefault();
        const codeNumber = parseInt(inputCode, 10);
        const visitor = visitors.find((v) => v.code === codeNumber);
        if (visitor) {
            setResult({valid: true, visitor});
        } else {
            setResult({valid: false});
        }
    };

    return (
        <div className="container mt-5">
            <h3 className="mb-4 text-center">Validate Visitor Code</h3>

            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-sm p-4">
                        <form onSubmit={handleValidate}>
                            <div className="mb-3">
                                <label className="form-label">Enter 6-digit Code</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={inputCode}
                                    onChange={handleChange}
                                    placeholder="e.g. 123456"
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100">
                                Validate
                            </button>
                        </form>

                        {result && (
                            <div className="mt-4">
                                {result.valid ? (
                                    <div className="alert alert-success">
                                        <h5 className="mb-2">Valid Code</h5>
                                        <p>Name: {result.visitor.name}</p>
                                        <p>Email: {result.visitor.email}</p>
                                        <p>Phone: {result.visitor.phone || "N/A"}</p>
                                        <p>Visit Date: {result.visitor.visitDate}</p>
                                        <p>Purpose: {result.visitor.purpose || "N/A"}</p>
                                        <p className="fw-bold">Code: {result.visitor.code}</p>
                                    </div>
                                ) : (
                                    <div className="alert alert-danger">
                                        Invalid Code! Please check the 6-digit code.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ValidateCode;
