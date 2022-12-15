import RegisterTeamComponent from "../../components/TFF Admin Components/RegisterTeamComponent";
import ProfileAppBar from "../../components/User Components/ProfileAppBar";

export default function RegisterTeamPage() {
  const content = (
    <>
      <ProfileAppBar />
      <RegisterTeamComponent />
    </>
  );
  return content;
}
