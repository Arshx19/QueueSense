import React from "react";

function PublicDisplay() {
  const queue = {
    length: 10,
    waitTime: 5
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Now Serving</h1>
      <h2>Queue Length: {queue.length}</h2>
      <h3>Estimated Wait: {queue.waitTime} mins</h3>
    </div>
  );
}

export default PublicDisplay;