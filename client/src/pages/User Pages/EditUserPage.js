import EditUserComponent from "../../components/User Components/EditUserComponent";
import ProfileAppBar from "../../components/User Components/ProfileAppBar";

export default function EditUserPage() {
  const content = (
    <>
      <ProfileAppBar navItems={[]} />
      <EditUserComponent />
    </>
  );
  return content;
}
