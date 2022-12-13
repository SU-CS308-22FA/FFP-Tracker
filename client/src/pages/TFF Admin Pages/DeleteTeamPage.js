import DeleteTeamComponent from "../../components/TFF Admin Components/DeleteTeamComponent";
import ProfileAppBar from "../../components/User Components/ProfileAppBar";
import { UserContext } from "../../contexts/userContext";
import { useContext } from "react";

export default function RegisterTeamPage() {
  const { user } = useContext(UserContext);
  const content = (
    <>
      <ProfileAppBar user={user} />
      <DeleteTeamComponent />
    </>
  );
  return content;
}
