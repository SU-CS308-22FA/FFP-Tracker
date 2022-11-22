import FrontPageAppBar from "../../components/Public Components/FrontPageAppBar";
import SignUpComponent from "../../components/Public Components/SignUpComponent";

export default function SignupPage() {
  const content = (
    <>
      <FrontPageAppBar navItems={["Home", "Teams"]} />
      <SignUpComponent />
    </>
  );
  return content;
}
