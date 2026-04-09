import React from 'react';
const QueueCard = ({ queue }) => {
  const statusColor =
    queue.currentLength < queue.maxCapacity * 0.5 ? 'bg-green-500' :
    queue.currentLength < queue.maxCapacity * 0.8 ? 'bg-yellow-500' :
    'bg-red-500';

  return (
    <div className="border rounded p-4 shadow">
      <h2 className="text-lg font-semibold">{queue.name}</h2>
      <p>Length: {queue.currentLength}</p>
      <span className={`inline-block px-2 py-1 text-white ${statusColor}`}>
        {queue.currentLength < queue.maxCapacity * 0.5 ? 'Normal' :
         queue.currentLength < queue.maxCapacity * 0.8 ? 'Busy' : 'Overcrowded'}
      </span>
    </div>
  );
};

export default QueueCard;