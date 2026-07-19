import { S } from "../styles";

export default function Felsefe({ felsefe }) {
  const list = felsefe || [];
  return (
    <main style={S.main}>
      <div style={S.sh}><span style={S.st}>FELSEFE</span><div style={S.sl} /></div>
      {list.map((e) => (
        <div key={e.id} style={S.ared}>
          <h3 style={S.aredH}>{e.title}</h3>
          {e.content.split("\n\n").map((p, i) => (
            <p key={i} style={S.aredP}>{p}</p>
          ))}
        </div>
      ))}
    </main>
  );
}
