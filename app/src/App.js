import { Route, Routes } from "react-router-dom";
import { Connection } from "./pages/Connection";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Connection />} />
    </Routes>
  );
}

export default App;
