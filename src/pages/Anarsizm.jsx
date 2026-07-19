import { S } from "../styles";

export default function Anarsizm({ goBio, bios }) {
  const list = bios || [];
  return (
    <main style={S.main}>
      <div style={S.sh}><span style={S.st}>ANARŞİZM</span><div style={S.sl} /></div>
      <div style={S.ared}>
        <h3 style={S.aredH}>Anarşizm; kavga hâli değil, tahakkümün ve otoritenin yokluğudur.</h3>
        <p style={S.aredP}>Anarşizm hiç kimsenin hiç kimseye egemenlik kurmadığı doğal bir düzendir.</p>
      </div>
      <div style={S.sh}><span style={S.st}>Düşünürler ve TARİHSEL OLAYLAR</span><div style={S.sl} /></div>
      <div style={S.alist}>
        {list.map((b, i) => (
          <div key={b.id} style={{ ...S.arow, borderBottom: i < list.length - 1 ? "1px solid #222" : "none" }}
            onClick={() => goBio(b.id)}
            onMouseEnter={e => e.currentTarget.style.background = "#111"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <div style={S.adate}>{b.tarih}</div>
            <div><div style={S.atitle}>{b.isim}<small style={S.asmall}>{b.ozet.slice(0, 75)}...</small></div></div>
            <div style={S.atag}>{b.etiket}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
