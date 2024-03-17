import { Route, Routes } from "react-router-dom";
import { ConnectionList } from "./pages/Connection/List";
import { ConnectionCreate } from "./pages/Connection/Create";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ConnectionList />} />
      <Route path="/create-connection" element={<ConnectionCreate />} />
    </Routes>
  );
}

export default App;
