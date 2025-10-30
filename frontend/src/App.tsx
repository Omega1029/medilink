import { useEffect, useState } from "react";
import api from "./api";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/").then((res) => setMessage(res.data.message));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>🩺 Health Connect</h1>
      <p>{message}</p>
    </div>
  );
}

export default App;
