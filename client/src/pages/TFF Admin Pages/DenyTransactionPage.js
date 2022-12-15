import DenyTransactionComponent from "../../components/TFF Admin Components/DenyTransactionComponent";
import ProfileAppBar from "../../components/User Components/ProfileAppBar";

export default function RegisterTeamPage() {
  const content = (
    <>
      <ProfileAppBar />
      <DenyTransactionComponent />
    </>
  );
  return content;
}
