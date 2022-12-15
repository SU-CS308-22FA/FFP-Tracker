import DeleteTeamComponent from "../../components/TFF Admin Components/DeleteTeamComponent";
import ProfileAppBar from "../../components/User Components/ProfileAppBar";

export default function RegisterTeamPage() {
  const content = (
    <>
      <ProfileAppBar />
      <DeleteTeamComponent />
    </>
  );
  return content;
}
