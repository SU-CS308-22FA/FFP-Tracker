import ProfileAppBar from "../../components/User Components/ProfileAppBar";
import ProfilePageComponent from "../../components/User Components/ProfilePageComponent";

export default function ProfilePage() {
  const content = (
    <>
      <ProfileAppBar />
      <ProfilePageComponent />
    </>
  );
  return content;
}
