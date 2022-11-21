import ProfileAppBar from "../../components/User Components/ProfileAppBar";
import SendKeyComponent from "../../components/TFF Admin Components/SendKeyComponent";
import { UserContext } from "../../contexts/userContext";
import { useContext } from "react";

export default function SendKeyPage() {
  const { user } = useContext(UserContext);
  const content = (
    <>
      <ProfileAppBar user={user} />
      <SendKeyComponent />
    </>
  );
  return content;
}
