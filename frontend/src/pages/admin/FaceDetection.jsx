import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";

const FaceAttendance = () => {
  const webcamRef = useRef(null);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const captureImage = () => webcamRef.current.getScreenshot();


  const registerFace = async () => {
    const imageSrc = captureImage();
   try {
    const res = await axios.post("http://127.0.0.1:5000/face/register", {
      name,
      image: imageSrc,
    });
    setMessage(res.data.message);
  } catch (err) {
    // Handle 400 or other errors
    console.error("Registration error:", err.response?.data || err.message);
    setMessage(err.response?.data?.message || "Error registering face");
  }

  };

  const markAttendance = async () => {
    const imageSrc = captureImage();
     try {
    const res = await axios.post("http://127.0.0.1:5000/face/attendance", {
      image: imageSrc,
    });
    setMessage(res.data.message);
  } catch (err) {
    // Handle 400 or other errors
    console.error("Attendance error:", err.response?.data || err.message);
    setMessage(err.response?.data?.message || "Error marking attendance");
  }
  };

  return (
    <div style={{ textAlign: "center", marginTop: 30 }}>
      <h2>Face Recognition Attendance</h2>
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={320}
        height={240}
      />
      <div style={{ marginTop: 20 }}>
        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={registerFace}>Register Face</button>
        <button onClick={markAttendance}>Mark Attendance</button>
      </div>
      <p>{message}</p>
    </div>
  );
};

export default FaceAttendance;
