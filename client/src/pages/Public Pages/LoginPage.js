import FrontPageAppBar from "../../components/Public Components/FrontPageAppBar";
import LoginComponent from "../../components/Public Components/LoginComponent";

export default function LoginPage() {
  const content = (
    <>
      <FrontPageAppBar navItems={["Home", "Teams", "Sign Up"]} />
      <LoginComponent />
    </>
  );
  return content;
}
