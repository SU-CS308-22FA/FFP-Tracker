import React from "react";
import FrontPageAppBar from "../components/FrontPageAppBar";

export default function HomePage() {
  const content = (
    <>
      <FrontPageAppBar navItems={["Teams", "Login", "Sign Up"]} />
      <center>
        <h1>About This Site</h1>
      </center>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque lacus
        arcu, sodales vitae libero quis, suscipit elementum tortor. Maecenas
        varius finibus magna, vel varius libero porttitor at. Pellentesque
        habitant morbi tristique senectus et netus et malesuada fames ac turpis
        egestas. Nulla porta in velit eleifend cursus. Duis varius vehicula
        vehicula. Nam dignissim blandit feugiat. Praesent vitae massa mauris.
        Vestibulum tempor nisl et condimentum hendrerit. Lorem ipsum dolor sit
        amet, consectetur adipiscing elit. Quisque lacus arcu, sodales vitae
        libero quis, suscipit elementum tortor. Maecenas varius finibus magna,
        vel varius libero porttitor at. Pellentesque habitant morbi tristique
        senectus et netus et malesuada fames ac turpis egestas. Nulla porta in
        velit eleifend cursus. Duis varius vehicula vehicula. Nam dignissim
        blandit feugiat. Praesent vitae massa mauris. Vestibulum tempor nisl et
        condimentum hendrerit.
      </p>
    </>
  );
  return content;
}
