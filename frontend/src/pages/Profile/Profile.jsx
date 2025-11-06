import React, { useState } from "react";

function UserProfile() {
    const [profile, setProfile] = useState({
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "9876543210",
        role: "Resident",
        password: "",
        newPassword: "",
        profilePic: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfile({ ...profile, profilePic: URL.createObjectURL(file) });
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        // Save profile logic here
        alert("Profile updated successfully!");
    };

    return (
        <div className="container mt-5">
            <h3 className="mb-4 text-center">User Profile</h3>
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-sm p-4">
                        <form onSubmit={handleSave}>
                            {/* Profile Picture */}
                            <div className="text-center mb-4">
                                <img
                                    src={profile.profilePic || "/default-profile.png"}
                                    alt="Profile"
                                    className="rounded-circle"
                                    width="120"
                                    height="120"
                                />
                                <div className="mt-2">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            </div>

                            {/* Name */}
                            <div className="mb-3">
                                <label className="form-label">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    value={profile.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Email */}
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    value={profile.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {/* Phone */}
                            <div className="mb-3">
                                <label className="form-label">Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    className="form-control"
                                    value={profile.phone}
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Role */}
                            <div className="mb-3">
                                <label className="form-label">Role</label>
                                <input
                                    type="text"
                                    name="role"
                                    className="form-control"
                                    value={profile.role}
                                    disabled
                                />
                            </div>

                            {/* Password */}
                            <div className="mb-3">
                                <label className="form-label">New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    className="form-control"
                                    value={profile.newPassword}
                                    onChange={handleChange}
                                />
                            </div>

                            <button type="submit" className="btn btn-primary w-100">
                                Save Changes
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserProfile;
