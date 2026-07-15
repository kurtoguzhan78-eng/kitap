import { FOTOGRAFLAR } from "../data/fotograflar";
import FotoKart from "../components/FotoKart";
import AnarsiA from "../components/AnarsiA";

export default function Home() {
  return (
    <div style={{ position: "relative", minHeight: "88vh" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", minHeight: "88vh" }}>
        {FOTOGRAFLAR.map((f, i) => <FotoKart key={i} foto={f} borderRight={i < 3} />)}
      </div>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 10, pointerEvents: "none", width: "min(48vw,390px)" }}>
        <AnarsiA width="100%" height="100%" glow={true} />
      </div>
    </div>
  );
}
