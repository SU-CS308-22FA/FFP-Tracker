import NotificationForm from "../../components/User Components/NotificationForm";
import ProfileAppBar from "../../components/User Components/ProfileAppBar";

export default function SendNotificationPage() {
  const content = (
    <>
      <ProfileAppBar />
      <NotificationForm />
    </>
  );
  return content;
}
