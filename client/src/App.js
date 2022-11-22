import "./App.css";
import { Routes, Route } from "react-router-dom";
import SignupPage from "./pages/Public Pages/SignupPage";
import LoginPage from "./pages/Public Pages/LoginPage";
import HomePage from "./pages/Public Pages/HomePage";
import TeamsPage from "./pages/Public Pages/TeamsPage";
import DetailedTeamPage from "./pages/Public Pages/DetailedTeamPage";
import EditUserPage from "./pages/User Pages/EditUserPage";
import ProfilePage from "./pages/User Pages/ProfilePage";
import NotificationPage from "./pages/User Pages/NotificationPage"; // user pages ekle
import { UserContextProvider } from "./contexts/userContext";
import RegisterTeamPage from "./pages/TFF Admin Pages/RegisterTeamPage";
import RequireAuth from "./components/RequireAuth";
import { ROLES } from "./app/roles";
import PersistLogin from "./components/PersistLogin";
import SendKeyPage from "./pages/TFF Admin Pages/SendKeyPage";
import FileSubmitPage from "./pages/Team Admin Pages/FileSubmitPage";
import SendNotificationPage from "./pages/User Pages/SendNotificationPage";

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
        {/*Protected Routes*/}
        <Route element={<PersistLogin />}>
          <Route path="/my/profile">
            <Route index element={<ProfilePage />} />
            <Route path="edit" element={<EditUserPage />} />
            {/*<Route path="notifications" element={} />*/}
          </Route>
          <Route path="/notifications">
            <Route index element={<NotificationPage />}></Route>
          </Route>
          <Route path="/sendnotification">
            <Route index element={<SendNotificationPage />}></Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={[ROLES.TEAM_ADMIN]} />}>
            <Route path="/submit" element={<FileSubmitPage />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.TFF_ADMIN]} />}>
            <Route path="/newteam" element={<RegisterTeamPage />} />
            <Route path="register" element={<SendKeyPage />} />
          </Route>
        </Route>
        <Route path="/notification" element={<NotificationPage />} />
        <Route path="/sendnotification" element={<SendNotificationPage />} />
      </Routes>
    </UserContextProvider>
  );
}

export default App;
