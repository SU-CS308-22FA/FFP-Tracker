import FrontPageAppBar from "../components/FrontPageAppBar";
import TeamsComponent from "../components/TeamsComponent";

export default function TeamsPage() {
  const content = (
    <>
      <FrontPageAppBar navItems={["Home", "Notification", "Login", "Sign Up"]} />
      <TeamsComponent />
    </>
  );
  return content;
}
