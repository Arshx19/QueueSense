const historyData = [];

const startDate = new Date("2025-01-01");

for (let i = 0; i < 500; i++) {
  const date = new Date(startDate);
  date.setDate(startDate.getDate() + i);

  historyData.push({
    date: date.toISOString().split("T")[0],
    length: 10 + Math.floor(Math.sin(i / 5) * 10 + Math.random() * 5),
    waitTime: 5 + Math.floor(Math.sin(i / 6) * 5 + Math.random() * 3),
  });
}

export default historyData;