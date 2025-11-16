import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const FaceVisitorUI = () => {
  const webcamRef = useRef(null);

  // Registration inputs
  const [name, setName] = useState("");
  const [workType, setWorkType] = useState("");

  // Backup code login
  const [backupCode, setBackupCode] = useState("");

  // Message display
  const [message, setMessage] = useState("");

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
      const res = await axios.post("http://127.0.0.1:5000/faceVisitor/register", {
        name,
        work_type: workType,
        image: imageSrc,
      });

      setMessage(
        `Registration successful. Visitor Code: ${res.data.backup_code}`
      );

      setBackupCode(res.data.backup_code);
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
      const res = await axios.post("http://127.0.0.1:5000/faceVisitor/recognize", {
        image: imageSrc,
      });

      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Recognition error");
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
      const res = await axios.post("http://127.0.0.1:5000/faceVisitor/verify_code", {
        backup_code: backupCode,
      });

      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid backup code");
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
        /><br/><br/>

        <input
          type="text"
          placeholder="Work Type (Milkman, Paperboy etc)"
          value={workType}
          onChange={(e) => setWorkType(e.target.value)}
        /><br/><br/>

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
      <br/><br/>
      <button onClick={verifyByCode}>Verify Code</button>

      {/* RESPONSE MESSAGE */}
      <p style={{ marginTop: 20, fontSize: "18px", fontWeight: "bold" }}>
        {message}
      </p>
    </div>
  );
};

export default FaceVisitorUI;
