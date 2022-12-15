import NotificationPageComponent from "../../components/User Components/NotificationPageComponent";
import ProfileAppBar from "../../components/User Components/ProfileAppBar";

export default function NotificationPage() {
  const content = (
    <>
      <ProfileAppBar />
      <NotificationPageComponent />
    </>
  );
  return content;
}
