import ProfileAppBar from "../../components/User Components/ProfileAppBar";
import FileSubmitComponent from "../../components/Team Admin Components/FileSubmitComponent";
import { useContext } from "react";
import { UserContext } from "../../contexts/userContext";

export default function FileSubmitPage() {
  const { user } = useContext(UserContext);
  const content = (
    <>
      <ProfileAppBar user={user} />
      <FileSubmitComponent />
    </>
  );
  return content;
}
