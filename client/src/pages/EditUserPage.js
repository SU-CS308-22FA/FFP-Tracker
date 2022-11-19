import EditUserComponent from "../components/EditUserComponent";
import ProfileAppBar from "../components/ProfileAppBar";

export default function EditUserPage() {
  const content = (
    <>
      <ProfileAppBar />
      <EditUserComponent />
    </>
  );
  return content;
}
