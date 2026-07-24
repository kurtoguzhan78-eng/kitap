import { S } from "../styles";
import { SEKME_ADI } from "../constants";

export default function Konular({ konular }) {
  const list = konular || [];
  return (
    <main style={S.main} className="nm-main">
      <div style={S.sh}><span style={S.st} className="nm-st">{SEKME_ADI}</span><div style={S.sl} /></div>
      {list.length === 0 && (
        <div style={S.ared} className="nm-ared">
          <p style={S.aredP}>Bu bölüme henüz içerik eklenmedi.</p>
        </div>
      )}
      {list.map((e) => (
        <div key={e.id} style={S.ared} className="nm-ared">
          {e.title && <h3 style={S.aredH} className="nm-aredh">{e.title}</h3>}
          {e.content.split("\n\n").map((p, i) => (
            <p key={i} style={S.aredP}>{p}</p>
          ))}
        </div>
      ))}
    </main>
  );
}
