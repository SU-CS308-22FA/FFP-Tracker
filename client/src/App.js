import "./App.css";
import { Routes, Route } from "react-router-dom";
import SignupPage from "./pages/Public Pages/SignupPage";
import LoginPage from "./pages/Public Pages/LoginPage";
import HomePage from "./pages/Public Pages/HomePage";
import TeamsPage from "./pages/Public Pages/TeamsPage";
import DetailedTeamPage from "./pages/Public Pages/DetailedTeamPage";
import EditUserPage from "./pages/User Pages/EditUserPage";
import ProfilePage from "./pages/User Pages/ProfilePage";
import { UserContextProvider } from "./contexts/userContext";
import FileSubmitPage from "./pages/Team Admin Pages/FileSubmitPage";
import RegisterTeamPage from "./pages/TFF Admin Pages/RegisterTeamPage";

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/teams">
          <Route path="" element={<TeamsPage />} />
          <Route path=":id" element={<DetailedTeamPage />} />
        </Route>
        <Route path="/my/profile/">
          <Route path=":id" element={<ProfilePage />} />
          <Route path="edit/:id" element={<EditUserPage />} />
          <Route path="submit/:id" element={<FileSubmitPage />} />
        </Route>
        <Route path="/submit" element={<FileSubmitPage />} />
        <Route path="/register" element={<RegisterTeamPage />} />
      </Routes>
    </UserContextProvider>
  );
}

export default App;
