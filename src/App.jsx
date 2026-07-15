import { useState } from "react";
import { MAKALELER } from "./data/makaleler";
import { BIO_DATA } from "./data/bioData";
import { S } from "./styles";

import Header from "./components/Header";
import Ticker from "./components/Ticker";
import Footer from "./components/Footer";
import BioDetail from "./components/BioDetail";

import Home from "./pages/Home";
import Yazilar from "./pages/Yazilar";
import Felsefe from "./pages/Felsefe";
import Anarsizm from "./pages/Anarsizm";
import Hakkinda from "./pages/Hakkinda";
import Article from "./pages/Article";

export default function App() {
  const [page, setPage] = useState("home");
  const [prev, setPrev] = useState("home");
  const [artId, setArtId] = useState(null);
  const [bioId, setBioId] = useState(null);

  const go = (p) => { setPage(p); setBioId(null); setArtId(null); };
  const goArt = (id) => { setPrev(page); setArtId(id); setPage("article"); };
  const goBio = (id) => { setBioId(id); setPage("bio"); };

  const activeNav = page === "bio" ? "anarsizm" : page === "article" ? prev : page;
  const navItems = [
    { id: "home", label: "ANA SAYFA" },
    { id: "yazilar", label: "YAZILAR" },
    { id: "felsefe", label: "FELSEFE" },
    { id: "anarsizm", label: "ANARŞİZM" },
    { id: "hakkinda", label: "HAKKINDA" },
  ];

  const makale = MAKALELER.find(m => m.id === artId);
  const bio = BIO_DATA.find(b => b.id === bioId);

  const tickerText = "Mülkiyet hırsızlıktır — Proudhon · Hukuk iktidarın fahişesidir — Bakunin · Yıkma tutkusu aynı zamanda yaratıcı bir tutkudur — Bakunin · Karşılıklı yardımlaşma türlerin hayatta kalmasındaki asıl güçtür — Kropotkin · Eğer Tanrı varsa insan köle olmak zorundadır — Bakunin · Hükümet olmaksızın düzen — Proudhon · Ekmek herkes içindir — Kropotkin · ";

  return (
    <div style={S.body}>
      <style>{`
        @keyframes kaosticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        *{box-sizing:border-box;margin:0;padding:0}
        button:focus{outline:none}
      `}</style>

      <Header navItems={navItems} activeNav={activeNav} go={go} />

      <Ticker tickerText={tickerText} />

      {page === "home" && <Home />}

      {page === "yazilar" && <Yazilar goArt={goArt} />}

      {page === "felsefe" && <Felsefe />}

      {page === "anarsizm" && <Anarsizm goBio={goBio} />}

      {page === "bio" && bio && <BioDetail bio={bio} onBack={() => go("anarsizm")} />}

      {page === "hakkinda" && <Hakkinda />}

      {page === "article" && makale && <Article makale={makale} go={go} prev={prev} />}

      <Footer />
    </div>
  );
}
