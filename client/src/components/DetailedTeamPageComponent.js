import Plot from "react-plotly.js";

export default function DetailedTeamPageComponent() {
  const plot = (
    <Plot
      data={[
        { type: "bar", x: ["Aug 2021", "Sep 2021", "Nov 2021"], y: [2, 3, 3] },
        { type: "line", x: ["Aug 2021", "Sep 2021", "Nov 2021"], y: [2, 5, 8] },
      ]}
      layout={{
        width: 320,
        height: 240,
        title: `<Team Name>`,
      }}
    />
  );
  const content = (
    <>
      <center>
        <div>{plot}</div>
      </center>
    </>
  );
  return content;
}
