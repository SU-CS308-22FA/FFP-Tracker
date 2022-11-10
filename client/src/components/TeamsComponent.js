import Plot from "react-plotly.js";

export default function TeamsComponent() {
  const plot = (
    <Plot
      data={[
        { type: "bar", x: ["Aug 2021", "Sep 2021", "Nov 2021"], y: [2, 3, 3] },
        { type: "line", x: ["Aug 2021", "Sep 2021", "Nov 2021"], y: [2, 5, 8] },
      ]}
      layout={{
        width: 320,
        height: 240,
        title: `<a href="/teams/${1}" target ="_self">Team ${1}</a>`,
      }}
    />
  );
  const content = (
    <>
      <center>
        <div>
          {plot}
          {plot}
          {plot}
          {plot}
        </div>
        <div>
          {plot}
          {plot}
          {plot}
          {plot}
        </div>
        <div>
          {plot}
          {plot}
          {plot}
          {plot}
        </div>
        <div>
          {plot}
          {plot}
          {plot}
          {plot}
        </div>
      </center>
    </>
  );
  return content;
}
