import FrontPageAppBar from "../components/FrontPageAppBar";
import LoginComponent from "../components/LoginComponent";

export default function LoginPage() {
  const content = (
    <>
      <FrontPageAppBar navItems={["Home", "Teams", "Sign Up"]} />
      <LoginComponent />
    </>
  );
  return content;
}
