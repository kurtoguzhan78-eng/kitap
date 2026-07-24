import { S } from "../styles";
import ArticleBody from "../components/ArticleBody";

export default function Article({ makale, go, prev }) {
  return (
    <main style={S.main} className="nm-main">
      <button style={S.backBtn} onClick={() => go(prev)}>← Geri Dön</button>
      <div style={S.artWrap}>
        <span style={S.artTag}>{makale.tag}</span>
        <h1 style={S.artTitle}>{makale.title}</h1>
        <div style={S.artMeta}>{makale.date}</div>
        <ArticleBody body={makale.body} />
      </div>
    </main>
  );
}
