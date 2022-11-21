import FrontPageAppBar from "../../components/Public Components/FrontPageAppBar";
import LoginComponent from "../../components/Public Components/LoginComponent";
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../contexts/userContext";

export default function LoginPage() {
  const { user } = useContext(UserContext);
  if (user) {
    return <Navigate to="/my/profile" />;
  }
  const content = (
    <>
      <FrontPageAppBar navItems={["Home", "Teams", "Sign Up"]} />
      <LoginComponent />
    </>
  );
  return content;
}
