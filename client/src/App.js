import "./App.css";
import { Routes, Route } from "react-router-dom";
import SignupPage from "./pages/Public Pages/SignupPage";
import LoginPage from "./pages/Public Pages/LoginPage";
import HomePage from "./pages/Public Pages/HomePage";
import TeamsPage from "./pages/Public Pages/TeamsPage";
import DetailedTeamPage from "./pages/Public Pages/DetailedTeamPage";
import EditUserPage from "./pages/User Pages/EditUserPage";
import ProfilePage from "./pages/User Pages/ProfilePage";
import NotificationPage from "./pages/User Pages/NotificationPage";
import { UserContextProvider } from "./contexts/userContext";
import RegisterTeamPage from "./pages/TFF Admin Pages/RegisterTeamPage";
import DeleteTeamPage from "./pages/TFF Admin Pages/DeleteTeamPage";
import DenyTransactionPage from "./pages/TFF Admin Pages/DenyTransactionPage";
import RequireAuth from "./components/RequireAuth";
import { ROLES } from "./app/roles";
import PersistLogin from "./components/PersistLogin";
import SendKeyPage from "./pages/TFF Admin Pages/SendKeyPage";
import FileSubmitPage from "./pages/Team Admin Pages/FileSubmitPage";
import SendNotificationPage from "./pages/User Pages/SendNotificationPage";
import FileStatusPage from "./pages/User Pages/FileStatusPage";
import EditTeamPage from "./pages/Team Admin Pages/EditTeamPage";
import PlayersPage from "./pages/Team Admin Pages/PlayersPage";
import PenaltyPage from "./pages/TFF Admin Pages/PenaltyPage";
import SupportRequestReviewPage from "./pages/Team Admin Pages/SupportRequestReviewPage";
import SupportTeamPage from "./pages/Supporter Pages/SupportTeamPage";

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/teams">
          <Route index element={<TeamsPage />} />
          <Route path=":id" element={<DetailedTeamPage />} />
        </Route>
        {/*Protected Routes*/}
        <Route element={<PersistLogin />}>
          <Route path="/status" element={<FileStatusPage />} />
          <Route path="/my/profile">
            <Route index element={<ProfilePage />} />
            <Route path="edit" element={<EditUserPage />} />
            <Route path="notifications" element={<NotificationPage />} />
          </Route>
          <Route path="/sendnotification">
            <Route index element={<SendNotificationPage />}></Route>
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.TEAM_ADMIN]} />}>
            <Route path="/submit" element={<FileSubmitPage />} />
            <Route path="/edit/team/" element={<EditTeamPage />} />
            <Route path="/edit/team/players" element={<PlayersPage />} />
            <Route
              path="/supportrequest"
              element={<SupportRequestReviewPage />}
            />
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.TFF_ADMIN]} />}>
            <Route path="/penalty" element={<PenaltyPage />} />
            <Route path="/denytransaction" element={<DenyTransactionPage />} />
            <Route path="/newteam" element={<RegisterTeamPage />} />
            <Route path="/deleteteam" element={<DeleteTeamPage />} />
            <Route path="/register" element={<SendKeyPage />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[ROLES.SUPPORTER]} />}>
            <Route path="/supportteam" element={<SupportTeamPage />} />
          </Route>
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
