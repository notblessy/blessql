import { Route, Routes } from "react-router-dom";
import { ConnectionList } from "./pages/Connection/List";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ConnectionList />} />
    </Routes>
  );
}

export default App;
