import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import {faceVisitorApi} from "../../services/api";

const FaceVisitorUI = () => {
  const webcamRef = useRef(null);

  // Registration inputs
  const [name, setName] = useState("");
  const [workType, setWorkType] = useState("");

  // Backup code login
  const [backupCode, setBackupCode] = useState("");

  // Response message
  const [message, setMessage] = useState("");

  // Recognized visitor info
  const [visitorInfo, setVisitorInfo] = useState(null);

  // Capture image
  const captureImage = () => webcamRef.current.getScreenshot();

  // ------------------------------------------
  // REGISTER VISITOR
  // ------------------------------------------
  const registerVisitor = async () => {
    if (!name || !workType) {
      setMessage("Name & Work Type are required.");
      return;
    }

    const imageSrc = captureImage();

    try {
      const data = await faceVisitorApi.registerVisitor({
        name,
        work_type: workType,
        image: imageSrc,
      });

      setMessage(`Registration successful. Visitor Code: ${data.backup_code}`);
      setBackupCode(data.backup_code);
      setVisitorInfo(null); // clear any previous info
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration error");
    }
  };

  // ------------------------------------------
  // RECOGNIZE VISITOR (FACE SCAN)
  // ------------------------------------------
  const recognizeVisitor = async () => {
    const imageSrc = captureImage();

    try {
      const data = await faceVisitorApi.recognizeVisitor(imageSrc);

      setMessage(data.message);
      setVisitorInfo({
        visitor_id: data.visitor_id,
        name: data.name,
        work_type: data.work_type || "-",
        last_seen: new Date().toLocaleString(),
        similarity: data.similarity?.toFixed(3),
      });
    } catch (err) {
      setMessage(err.response?.data?.message || "Recognition error");
      setVisitorInfo(null);
    }
  };

  // ------------------------------------------
  // VERIFY BACKUP CODE
  // ------------------------------------------
  const verifyByCode = async () => {
    if (!backupCode) {
      setMessage("Enter your visitor code");
      return;
    }

    try {
      const data = await faceVisitorApi.verifyBackupCode(backupCode);

      setMessage(data.message);
      setVisitorInfo({
        visitor_id: data.visitor_id,
        name: data.name,
        work_type: data.work_type || "-",
        last_seen: new Date().toLocaleString(),
      });
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid backup code");
      setVisitorInfo(null);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: 20 }}>
      <h2>Visitor Face Recognition System</h2>

      {/* CAMERA */}
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={320}
        height={240}
      />

      {/* REGISTRATION */}
      <div style={{ marginTop: 20 }}>
        <h3>Register Visitor</h3>
        <input
          type="text"
          placeholder="Visitor Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br />
        <br />
        <input
          type="text"
          placeholder="Work Type (Milkman, Paperboy etc)"
          value={workType}
          onChange={(e) => setWorkType(e.target.value)}
        />
        <br />
        <br />
        <button onClick={registerVisitor}>Register Face</button>
      </div>

      <hr style={{ margin: "30px" }} />

      {/* FACE RECOGNITION */}
      <div>
        <h3>Scan to Enter</h3>
        <button onClick={recognizeVisitor}>Scan Face</button>
      </div>

      <hr style={{ margin: "30px" }} />

      {/* BACKUP CODE */}
      <h3>Enter Using Visitor Code</h3>
      <input
        type="text"
        placeholder="Enter 6-digit Visitor Code"
        value={backupCode}
        onChange={(e) => setBackupCode(e.target.value)}
      />
      <br />
      <br />
      <button onClick={verifyByCode}>Verify Code</button>

      {/* RESPONSE MESSAGE */}
      <p style={{ marginTop: 20, fontSize: "18px", fontWeight: "bold" }}>
        {message}
      </p>

      {/* VISITOR INFO DISPLAY */}
      {visitorInfo && (
        <div
          style={{
            marginTop: 20,
            border: "1px solid #ccc",
            padding: 15,
            display: "inline-block",
            textAlign: "left",
            borderRadius: 8,
            backgroundColor: "#f9f9f9",
          }}
        >
          <h4>Visitor Info</h4>
          <p>
            <strong>ID:</strong> {visitorInfo.visitor_id}
          </p>
          <p>
            <strong>Name:</strong> {visitorInfo.name}
          </p>
          <p>
            <strong>Work Type:</strong> {visitorInfo.work_type}
          </p>
          {visitorInfo.last_seen && (
            <p>
              <strong>Last Seen:</strong> {visitorInfo.last_seen}
            </p>
          )}
          {visitorInfo.similarity && (
            <p>
              <strong>Similarity:</strong> {visitorInfo.similarity}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default FaceVisitorUI;
