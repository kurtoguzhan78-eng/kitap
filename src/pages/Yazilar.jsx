import { S } from "../styles";
import { MAKALELER } from "../data/makaleler";

export default function Yazilar({ goArt }) {
  return (
    <main style={S.main}>
      <div style={S.sh}><span style={S.st}>YAZILAR</span><div style={S.sl} /></div>
      <div style={S.alist}>
        {MAKALELER.map((m, i) => (
          <div key={m.id} style={{ ...S.arow, borderBottom: i < MAKALELER.length - 1 ? "1px solid #222" : "none" }}
            onClick={() => goArt(m.id)}
            onMouseEnter={e => e.currentTarget.style.background = "#111"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <div style={S.adate}>{m.date}</div>
            <div><div style={S.atitle}>{m.title}<small style={S.asmall}>{m.desc}</small></div></div>
            <div style={S.atag}>{m.tag}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
