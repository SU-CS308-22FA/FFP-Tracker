import CustomAppBar from "../components/FrontPageAppBar";
import DetailedTeamPageComponent from "../components/DetailedTeamPageComponent";

export default function DetailedTeamPage() {
  const content = (
    <>
      <CustomAppBar navItems={["Home", "Teams"]} />
      <DetailedTeamPageComponent />
      
    </>
  );
  return content;
}
