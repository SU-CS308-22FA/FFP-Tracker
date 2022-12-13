import DenyTransactionComponent from "../../components/TFF Admin Components/DenyTransactionComponent";
import ProfileAppBar from "../../components/User Components/ProfileAppBar";
import { UserContext } from "../../contexts/userContext";
import { useContext } from "react";

export default function RegisterTeamPage() {
  const { user } = useContext(UserContext);
  const content = (
    <>
      <ProfileAppBar user={user} />
      <DenyTransactionComponent />
    </>
  );
  return content;
}
