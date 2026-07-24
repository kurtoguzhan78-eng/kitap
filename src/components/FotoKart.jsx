import { useState } from "react";
import { RED } from "../constants";

export default function FotoKart({ foto, borderRight }) {
  const [hata, setHata] = useState(false);
  return (
    <div className="nm-foto" style={{ position: "relative", overflow: "hidden", borderRight: borderRight ? "1px solid #1a1a1a" : "none", minHeight: "88vh", background: "#0d0d0d" }}>
      {!hata
        ? <img className="nm-fotoimg" src={foto.src} alt={foto.isim} onError={() => setHata(true)} style={{ width: "100%", height: "100%", minHeight: "88vh", objectFit: "cover", objectPosition: "top center", display: "block", filter: "grayscale(100%) contrast(1.15) brightness(0.55)" }} />
        : <div className="nm-fotoimg" style={{ width: "100%", minHeight: "88vh", background: "#111", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "#222", fontSize: "5rem", fontWeight: 700 }}>{foto.isim[0]}</span>
        </div>
      }
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.97) 100%)", pointerEvents: "none" }} />
      <div className="nm-fotocap" style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "1.8rem 1.3rem", zIndex: 3 }}>
        <p style={{ fontStyle: "italic", fontSize: "0.72rem", color: RED, lineHeight: 1.65, marginBottom: "0.7rem" }}>"{foto.alinti}"</p>
        <span style={{ fontSize: "0.92rem", fontWeight: 700, color: "#f2ede6", display: "block" }}>{foto.isim}</span>
        <span style={{ fontSize: "0.6rem", color: "#555" }}>{foto.tarih}</span>
      </div>
    </div>
  );
}
