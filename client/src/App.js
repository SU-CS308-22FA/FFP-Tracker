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
import FileSubmitPage from "./pages/FileSubmitPage";
import SendNotificationPage from "./pages/SendNotificationPage";

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
        <Route path="/notification" element={<NotificationPage />} />
        <Route path="/sendnotification" element={<SendNotificationPage />} />
        
      </Routes>
    </UserContextProvider>
  );
}

export default App;
