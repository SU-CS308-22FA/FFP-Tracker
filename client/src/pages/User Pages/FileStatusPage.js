import ProfileAppBar from "../../components/User Components/ProfileAppBar";
import FileStatusComponent from "../../components/User Components/FileStatusComponent";

export default function FileStatusPage() {
  const content = (
    <>
      <ProfileAppBar />
      <FileStatusComponent />
    </>
  );
  return content;
}
