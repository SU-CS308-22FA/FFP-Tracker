import ProfileAppBar from "../../components/User Components/ProfileAppBar";
import EditTeamComponent from "../../components/Team Admin Components/EditTeamComponent";

export default function EditTeamPage() {
  const content = (
    <>
      <ProfileAppBar />
      <EditTeamComponent />
    </>
  );
  return content;
}
