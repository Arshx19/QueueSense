import React, { useState } from "react";

function QueuePage() {
  const [queue, setQueue] = useState({
    length: 10,
    waitTime: 5,
    isPaused: false
  });

  const addPerson = () => {
    setQueue(prev => ({ ...prev, length: prev.length + 1 }));
  };

  const serveNext = () => {
    if (queue.length > 0) {
      setQueue(prev => ({ ...prev, length: prev.length - 1 }));
    }
  };

  const resetQueue = () => {
    setQueue(prev => ({ ...prev, length: 0 }));
  };

  const togglePause = () => {
    setQueue(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Queue Management</h1>

      <h2>Queue Length: {queue.length}</h2>
      <p>Wait Time: {queue.waitTime} mins</p>

      <button onClick={addPerson}>Add Person</button>
      <button onClick={serveNext}>Serve Next</button>
      <button onClick={resetQueue}>Reset</button>
      <button onClick={togglePause}>
        {queue.isPaused ? "Resume" : "Pause"}
      </button>
    </div>
  );
}

export default QueuePage;