import ProfileAppBar from "../../components/User Components/ProfileAppBar";
import ProfilePageComponent from "../../components/User Components/ProfilePageComponent";
import { UserContext } from "../../contexts/userContext";
import { useContext } from "react";
import { Navigate } from "react-router-dom";

export default function ProfilePage() {
  const { user } = useContext(UserContext);
  if (!user) {
    return <Navigate to="/login" />;
  }
  return (
    <>
      <ProfileAppBar />
      <ProfilePageComponent />
    </>
  );
}
