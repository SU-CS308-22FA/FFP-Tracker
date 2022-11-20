import FrontPageAppBar from "../../components/Public Components/FrontPageAppBar";
import DetailedTeamPageComponent from "../../components/Public Components/DetailedTeamPageComponent";

export default function DetailedTeamPage() {
  const content = (
    <>
      <FrontPageAppBar navItems={["Home", "Teams"]} />
      <DetailedTeamPageComponent />
    </>
  );
  return content;
}
