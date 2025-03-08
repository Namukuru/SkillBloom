import { useEffect, useState } from "react";
import axios from "axios";
import Login from "./components/Login"; // Import the Login component

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/hello/")
      .then(response => setMessage(response.data.message))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h1>Django + React</h1>
      <p>{message}</p>

      {/* Add the Login component here */}
      <Login />
    </div>
  );
}

export default App;
