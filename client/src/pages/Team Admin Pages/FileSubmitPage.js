import ProfileAppBar from "../../components/User Components/ProfileAppBar";
import FileSubmitComponent from "../../components/Team Admin Components/FileSubmitComponent";

export default function FileSubmitPage() {
  const content = (
    <>
      <ProfileAppBar />
      <FileSubmitComponent />
    </>
  );
  return content;
}
