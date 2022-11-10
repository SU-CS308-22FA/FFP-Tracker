import EditUserComponent from "../components/EditUserComponent";
import CustomAppBar from "../components/FrontPageAppBar";

export default function EditUserPage() {
  const content = (
    <>
      <CustomAppBar navItems={[]} />
      <EditUserComponent />
    </>
  );
  return content;
}
