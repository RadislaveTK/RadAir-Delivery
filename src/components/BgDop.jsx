import "../styles/BgPanel.css";

export default function BgDop() {
  return (
    <>
      <div className="bg-panel"></div>
      <div
        style={{ left: "-15%", bottom: "-5%", top: "auto" }}
        className="bg-panel"
      ></div>
    </>
  );
}
