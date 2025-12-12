import { Routes, Route } from "react-router-dom";
import SearchPage from "./SearchPage";
import SongPage from "./SongPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SearchPage />} />
      <Route path="/song/:id" element={<SongPage />} />
    </Routes>
  );
}

export default App;
