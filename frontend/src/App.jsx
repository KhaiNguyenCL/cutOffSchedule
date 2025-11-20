import React, { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/hello")
      .then((res) => res.json())
      .then((data) => setData(data.msg))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-4">
      <h1>React + Python (Flask)</h1>
      <p>Server says: {data}</p>
    </div>
  );
}

export default App;
