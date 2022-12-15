import ProfileAppBar from "../../components/User Components/ProfileAppBar";
import SendKeyComponent from "../../components/TFF Admin Components/SendKeyComponent";

export default function SendKeyPage() {
  const content = (
    <>
      <ProfileAppBar />
      <SendKeyComponent />
    </>
  );
  return content;
}
