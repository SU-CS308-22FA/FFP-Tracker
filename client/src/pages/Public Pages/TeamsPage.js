import FrontPageAppBar from "../../components/Public Components/FrontPageAppBar";
import TeamsComponent from "../../components/Public Components/TeamsComponent";

export default function TeamsPage() {
  const content = (
    <>
      <FrontPageAppBar navItems={["Home", "Sign Up"]} />
      <TeamsComponent />
    </>
  );
  return content;
}
