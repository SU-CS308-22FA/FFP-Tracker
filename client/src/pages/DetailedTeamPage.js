import CustomAppBar from "../components/FrontPageAppBar";
import DetailedTeamPageComponent from "../components/DetailedTeamPageComponent";
import { useParams } from "react-router-dom";

export default function DetailedTeamPage() {
  const { id } = useParams();
  const content = (
    <>
      <CustomAppBar navItems={["Home", "Teams"]} />
      <DetailedTeamPageComponent />
    </>
  );
  return content;
}
