import { RED } from "../constants";
import { S } from "../styles";

export default function Hakkinda() {
  return (
    <main style={S.main}>
      <div style={S.sh}><span style={S.st}>HAKKINDA</span><div style={S.sl} /></div>
      <div style={S.ared}>
        <h3 style={S.aredH}>NOMASTER.com.tr Nedir?</h3>
        <p style={S.aredP}>NOMASTER.com.tr; felsefenin kuru akademik salonlarından çıkıp sokağa indiği bir deneme ve eleştiri platformudur.</p>
      </div>
      <div style={S.agrid}>
        <div style={S.abox}><h3 style={S.aboxH}>Ne Yazıyoruz?</h3><p style={S.aboxP}>Siyâset felsefesi, anarşist teori, devlet eleştirisi ve etik üzerine özgün denemeler.</p></div>
        <div style={S.abox}><h3 style={S.aboxH}>Neden Anarşizm?</h3><p style={S.aboxP}>Çünkü anarşizm rızâyı merkeze koyar. Var olan her sistem kendi ütopyasını dayatır; anarşizm bunun farkındadır.</p></div>
      </div>
      <div style={{ ...S.abox, marginBottom: "2.5rem" }}>
        <h3 style={S.aboxH}>İletişim</h3>
        <p style={S.aboxP}>Yazı göndermek için: <a href="mailto:kurtoguzhan78@gmail.com" style={{ color: RED, fontWeight: "bold", textDecoration: "none" }}>kurtoguzhan78@gmail.com</a></p>
      </div>
    </main>
  );
}
