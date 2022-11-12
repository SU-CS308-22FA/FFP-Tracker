import "./App.css";
import { Routes, Route } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import TeamsPage from "./pages/TeamsPage";
import DetailedTeamPage from "./pages/DetailedTeamPage";
import EditUserPage from "./pages/EditUserPage";
import ProfilePage from "./pages/ProfilePage";
import NotificationPage from "./pages/NotificationPage";
import { UserContextProvider } from "./contexts/userContext";

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
        <Route path="/editUser" element={<ProfilePage />}>
          <Route path=":id" element={<EditUserPage />} />
        </Route>
        <Route path="/my/profile/">
          <Route path=":id" element={<ProfilePage />} />
          <Route path="edit/:id" element={<EditUserPage />} />
        </Route>
        <Route path="/notification" element={<NotificationPage />} />
      </Routes>
    </UserContextProvider>
  );
}

export default App;
