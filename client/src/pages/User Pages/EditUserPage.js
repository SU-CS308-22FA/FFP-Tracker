import EditUserComponent from "../../components/User Components/EditUserComponent";
import ProfileAppBar from "../../components/User Components/ProfileAppBar";
import { useContext } from "react";
import { UserContext } from "../../contexts/userContext";

export default function EditUserPage() {
  const { user } = useContext(UserContext);
  const content = (
    <>
      <ProfileAppBar navItems={[]} />
      <EditUserComponent user={user} />
    </>
  );
  return content;
}
