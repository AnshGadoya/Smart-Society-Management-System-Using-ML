import React, {useRef, useState} from "react";
import Webcam from "react-webcam";
import {faceVisitorApi} from "../../../services/api";

const VisitorFaceRegistration = () => {
    const webcamRef = useRef(null);

    const [name, setName] = useState("");
    const [workType, setWorkType] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const captureImage = () => webcamRef.current.getScreenshot();

    const registerVisitor = async () => {
        if (!name || !workType) {
            setMessage("Name & Work Type are required.");
            return;
        }

        const imageSrc = captureImage();
        setLoading(true);

        try {
            const data = await faceVisitorApi.registerVisitor({
                name,
                work_type: workType,
                image: imageSrc,
            });

            setMessage(`Registration successful. Visitor Code: ${data.backup_code}`);
            setName("");
            setWorkType("");
        } catch (err) {
            setMessage(err.response?.data?.message || "Registration error");
        }
        setLoading(false);
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 p-3">
            <div
                className="card shadow-lg border-0 rounded-4"
                style={{
                    width: "440px",
                    background: "linear-gradient(135deg, #eaf6ff 0%, #fbebff 50%, #fff4ec 100%)",
                    backdropFilter: "blur(14px)",
                    WebkitBackdropFilter: "blur(14px)",

                    border: "1px solid rgba(255,255,255,0.6)",
                }}
            >
                <div className="card-body p-4">
                    {/* Title */}
                    <h2 className="text-center mb-4" style={{color: "#222", fontWeight: 800}}>
                        Visitor Face Registration
                    </h2>

                    {/* Camera */}
                    <div
                        className="rounded-4 overflow-hidden shadow-sm mb-4"
                        style={{
                            borderRadius: 18,
                            height: 260,
                            overflow: "hidden",
                            boxShadow: "0 18px 30px rgba(34,34,34,0.08)",
                        }}
                    >
                        <Webcam
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            className="w-100 h-100"
                            style={{objectFit: "cover", display: "block"}}
                        />
                    </div>

                    {/* Inputs */}
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control form-control-lg border-0 rounded-3"
                            placeholder="Visitor Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{
                                background: "rgba(255,255,255,0.9)",
                                color: "#222",
                                boxShadow: "inset 0 1px 0 rgba(0,0,0,0.03)",
                            }}
                        />
                    </div>

                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control form-control-lg border-0 rounded-3"
                            placeholder="Work Type"
                            value={workType}
                            onChange={(e) => setWorkType(e.target.value)}
                            style={{
                                background: "rgba(255,255,255,0.9)",
                                color: "#222",
                                boxShadow: "inset 0 1px 0 rgba(0,0,0,0.03)",
                            }}
                        />
                    </div>

                    {/* Register Button */}
                    <button
                        onClick={registerVisitor}
                        disabled={loading}
                        className="btn w-100 py-3 rounded-3 fw-semibold fs-5 shadow-sm text-white"
                        style={{
                            background: "linear-gradient(90deg,#6a11cb,#2575fc)",
                            border: "none",
                        }}
                    >
                        {loading ? (
                            <span className="spinner-border spinner-border-sm"></span>
                        ) : (
                            "Register Face"
                        )}
                    </button>

                    {/* Message */}
                    {message && (
                        <p className="text-center mt-3" style={{color: "#0b63d6", fontWeight: 700}}>
                            {message}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VisitorFaceRegistration;
