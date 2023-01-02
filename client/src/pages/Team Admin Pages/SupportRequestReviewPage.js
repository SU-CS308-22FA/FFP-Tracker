import ProfileAppBar from "../../components/User Components/ProfileAppBar";
import SupportRequestReviewComponent from "../../components/Team Admin Components/SupportRequestReviewComponent";

export default function SupportTeamPage() {
  const content = (
    <>
      <ProfileAppBar />
      <SupportRequestReviewComponent />
    </>
  );
  return content;
}
