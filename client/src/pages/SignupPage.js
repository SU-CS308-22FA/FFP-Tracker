import FrontPageAppBar from "../components/FrontPageAppBar";
import SignUpComponent from "../components/SignUpComponent";

export default function SignupPage() {
  const content = (
    <>
      <FrontPageAppBar navItems={["Home", "Teams", "Login"]} />
      <SignUpComponent />
    </>
  );
  return content;
}
