import { useState } from "react";
import { RED } from "../constants";
import { S } from "../styles";

export default function KonuDetail({ konu, onBack }) {
  const [open, setOpen] = useState(null);
  return (
    <main style={S.main}>
      <button style={S.backBtn} onClick={onBack}>← GERİ DÖN</button>
      <div style={S.artWrap}>
        <span style={S.artTag}>{konu.etiket}</span>
        <h1 style={S.artTitle}>{konu.baslik}</h1>
        <div style={S.artMeta}>{konu.tarih}</div>
        {konu.ozet && (
          <p style={{ ...S.artP, color: "#bbb", fontSize: "0.93rem", lineHeight: 1.9, marginBottom: "2.5rem" }}>{konu.ozet}</p>
        )}
        {konu.bolumler.map((b, i) => (
          <div key={i} style={{ borderTop: "1px solid #333" }}>
            <button onClick={() => setOpen(open === i ? null : i)}
              style={{ width: "100%", textAlign: "left", background: "none", border: "none", padding: "1.1rem 0", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "1rem", fontWeight: 700, color: open === i ? RED : "#f2ede6" }}>{b.baslik}</span>
              <span style={{ color: RED, fontSize: "1.2rem" }}>{open === i ? "-" : "+"}</span>
            </button>
            {open === i && b.icerik.split("\n\n").map((p, pi) => (
              <p key={pi} style={{ ...S.artP, fontSize: "0.88rem", lineHeight: 1.95, color: "#ccc" }}>{p}</p>
            ))}
          </div>
        ))}
        <div style={{ borderTop: "1px solid #333" }} />
      </div>
    </main>
  );
}
