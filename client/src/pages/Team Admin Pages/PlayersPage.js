import ProfileAppBar from "../../components/User Components/ProfileAppBar";
import PlayersComponent from "../../components/Team Admin Components/PlayersComponent";

export default function PlayersPage() {
  const content = (
    <>
      <ProfileAppBar />
      <PlayersComponent />
    </>
  );
  return content;
}
