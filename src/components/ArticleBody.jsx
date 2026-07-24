import { S } from "../styles";

export default function ArticleBody({ body }) {
  return (
    <div style={S.artBody} >
      {
        body.map((p, i) => p.startsWith("PULL:")
          ? <div key={i} className="nm-pull" style={S.pull}>{p.slice(5)}</div>
          : <p key={i} style={S.artP}>{p}</p>
        )
      }
    </div >
  );
}
