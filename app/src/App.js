import { Route, Routes } from "react-router-dom";
import { ConnectionList } from "./pages/Connection/List";
import { ConnectionCreate } from "./pages/Connection/Create";
import { Dashboard } from "./pages/Dashboard/dashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ConnectionList />} />
      <Route path="/create-connection" element={<ConnectionCreate />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
