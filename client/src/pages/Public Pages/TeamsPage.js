import FrontPageAppBar from "../../components/Public Components/FrontPageAppBar";
import TeamsComponent from "../../components/Public Components/TeamsComponent";
import { useContext } from "react";
import { UserContext } from "../../contexts/userContext";

export default function TeamsPage() {
  const { user } = useContext(UserContext);
  let navItems;
  if (user) {
    navItems = ["Home"];
  } else {
    navItems = ["Home", "Sign Up"];
  }

  const content = (
    <>
      <FrontPageAppBar navItems={navItems} />
      <TeamsComponent />
    </>
  );
  return content;
}
