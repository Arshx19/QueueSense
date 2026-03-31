import React from "react";

function Settings() {
    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh"
        }}>
            <div style={{
                width: "400px",
                padding: "20px",
                border: "1px solid #ccc",
                borderRadius: "10px"
            }}>
                <h1 style={{ textAlign: "center" }}>Queue Settings</h1>

                <div style={{ marginBottom: "15px" }}>
                    <label>Queue Name</label><br />
                    <input type="text" style={{ width: "100%", padding: "8px" }} />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label>Max Capacity</label><br />
                    <input type="number" style={{ width: "100%", padding: "8px" }} />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label>Service Rate</label><br />
                    <input type="number" style={{ width: "100%", padding: "8px" }} />
                </div>

                <button style={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "5px"
                }}>
                Save Changes
                </button>
            </div>
        </div>
    );
}

export default Settings;