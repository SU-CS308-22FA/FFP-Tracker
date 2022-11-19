import React from "react";
import ProfileAppBar from "../components/ProfileAppBar";
import FileSubmitComponent from "../components/FileSubmitComponent";

export default function FileSubmitPage() {
  const content = (
    <>
      <ProfileAppBar navItems={["Submit"]} />
      <FileSubmitComponent />
    </>
  );
  return content;
}
