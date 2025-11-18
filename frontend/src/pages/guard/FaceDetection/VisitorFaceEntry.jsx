import React, {useRef, useState, useEffect} from "react";
import Webcam from "react-webcam";
import {faceVisitorApi} from "../../../services/api";

const VISIT_COOLDOWN = 5 * 60 * 1000; // 5 minutes cooldown

const VisitorFaceEntry = () => {
    const webcamRef = useRef(null);

    const [backupCode, setBackupCode] = useState("");
    const [message, setMessage] = useState("");
    const [visitorInfo, setVisitorInfo] = useState(null);

    // Track last entry times per visitor_id
    const [lastEntryMap, setLastEntryMap] = useState({});

    const captureImage = () => webcamRef.current.getScreenshot();

    useEffect(() => {
        const interval = setInterval(async () => {
            if (!webcamRef.current) return;

            const imageSrc = captureImage();
            if (!imageSrc) return;

            try {
                const data = await faceVisitorApi.recognizeVisitor(imageSrc);

                // Check cooldown
                const lastEntry = lastEntryMap[data.visitor_id];
                const now = new Date().getTime();

                if (lastEntry && now - lastEntry < VISIT_COOLDOWN) {
                    setMessage(`${data.name} already entered recently.`);
                    setVisitorInfo({
                        visitor_id: data.visitor_id,
                        name: data.name,
                        work_type: data.work_type || "-",
                        last_seen: new Date(lastEntry).toLocaleString(),
                    });
                } else {
                    setMessage(`Entry allowed: ${data.name}`);
                    setVisitorInfo({
                        visitor_id: data.visitor_id,
                        name: data.name,
                        work_type: data.work_type || "-",
                        last_seen: new Date().toLocaleString(),
                    });
                    setLastEntryMap((prev) => ({...prev, [data.visitor_id]: now}));
                }
            } catch (err) {
                setMessage(err.response?.data?.message || "Invalid Face or backup code");
                setVisitorInfo(null);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [lastEntryMap]);

    // VERIFY BACKUP CODE
    const verifyByCode = async () => {
        if (!backupCode) {
            setMessage("Enter your visitor code");
            return;
        }

        try {
            const data = await faceVisitorApi.verifyBackupCode(backupCode);
            setMessage(`Entry allowed: ${data.name}`);
            setVisitorInfo({
                visitor_id: data.visitor_id,
                name: data.name,
                work_type: data.work_type || "-",
                last_seen: new Date().toLocaleString(),
            });
            setLastEntryMap((prev) => ({...prev, [data.visitor_id]: new Date().getTime()}));
        } catch (err) {
            setMessage(err.response?.data?.message || "Invalid backup code");
            setVisitorInfo(null);
        }
    };


    return (
        <>
            <style>{`
              .scan-frame {
              position: relative;
              width: 360px;
              height: 260px;
              border-radius: 22px;
              overflow: hidden;
              border: 2px solid rgba(255, 255, 255, 0.6);
              backdrop-filter: blur(8px);
              background: rgba(255, 255, 255, 0.35);
              box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            }
            
            /* REMOVE scanning line completely */
            .scan-line {
              display: none;
            }
            
            /* Smooth camera rounded corners */
            .scan-frame video, 
            .scan-frame canvas {
              border-radius: 22px !important;
              object-fit: cover;
            }
          `}</style>

            <div className="container py-4">
                <h2 className="text-center fw-bold mb-4">🚪 Visitor Entry System</h2>

                <div className="row justify-content-center">
                    {/* CAMERA CARD */}
                    <div className="col-md-6">
                        <div className="card shadow-lg border-0 rounded-4">
                            <div className="card-header text-white text-center rounded-top-4"
                                 style={{
                                     background: "linear-gradient(90deg, #6a11cb, #2575fc)"
                                 }}>
                                <h5 className="mb-0">Live Camera Scan</h5>
                            </div>

                            <div className="card-body d-flex justify-content-center">
                                <div className="scan-frame">
                                    <div className="scan-line"></div>

                                    <Webcam
                                        ref={webcamRef}
                                        width="100%"
                                        height="100%"
                                        className="rounded"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* BACKUP CODE ENTRY */}
                    <div className="col-md-4 mt-4 mt-md-0">
                        <div className="card shadow-lg border-0 rounded-4">
                            <div className="card-header bg-dark text-white text-center rounded-top-4">
                                <h5 className="mb-0">Backup Code Entry</h5>
                            </div>

                            <div className="card-body">
                                <input
                                    type="text"
                                    className="form-control form-control-lg mb-3 text-center"
                                    placeholder="Enter 6-digit Code"
                                    value={backupCode}
                                    onChange={(e) => setBackupCode(e.target.value)}
                                />

                                <button
                                    className="btn btn-dark w-100 btn-lg rounded-4"
                                    onClick={verifyByCode}
                                >
                                    Verify Code
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MESSAGE */}
                {message && (
                    <div className="alert alert-info text-center mt-4 fw-bold fs-5 shadow-sm">
                        {message}
                    </div>
                )}

                {/* VISITOR DETAILS */}
                {visitorInfo && (
                    <div
                        className="card shadow-lg border-0 rounded-4 mt-4 mx-auto"
                        style={{maxWidth: "500px"}}
                    >
                        <div className="card-header bg-success text-white text-center rounded-top-4">
                            <h5 className="mb-0">Visitor Details</h5>
                        </div>

                        <div className="card-body">
                            <p><strong>ID:</strong> {visitorInfo.visitor_id}</p>
                            <p><strong>Name:</strong> {visitorInfo.name}</p>
                            <p><strong>Work Type:</strong> {visitorInfo.work_type || "-"}</p>
                            <p><strong>Last Seen:</strong> {visitorInfo.last_seen}</p>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default VisitorFaceEntry;
