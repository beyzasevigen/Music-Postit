import { Routes, Route } from "react-router-dom";
import SearchPage from "./SearchPage";
import SongPage from "./SongPage";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import ProfilePage from "./ProfilePage"; // 🔴 EKSİK OLAN BUYDU
import NotificationsPage from "./NotificationsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SearchPage />} />
      <Route path="/song/:id" element={<SongPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
    </Routes>
  );
}

export default App;
