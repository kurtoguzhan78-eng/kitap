import { useState, useEffect } from "react";
import { MAKALELER } from "./data/makaleler";
import { BIO_DATA } from "./data/bioData";
import { FELSEFE } from "./data/felsefe";
import { KONULAR } from "./data/konular";
import { getArticles } from "./lib/articles";
import { getFelsefe } from "./lib/felsefe";
import { getBios } from "./lib/bios";
import { getKonular } from "./lib/konular";
import { S } from "./styles";
import { SEKME_ADI } from "./constants";

import Header from "./components/Header";
import Ticker from "./components/Ticker";
import Footer from "./components/Footer";
import BioDetail from "./components/BioDetail";

import Home from "./pages/Home";
import Yazilar from "./pages/Yazilar";
import Felsefe from "./pages/Felsefe";
import Anarsizm from "./pages/Anarsizm";
import Konular from "./pages/Konular";
import Hakkinda from "./pages/Hakkinda";
import Article from "./pages/Article";
import Admin from "./pages/Admin";

export default function App() {
  const [page, setPage] = useState("home");
  const [prev, setPrev] = useState("home");
  const [artId, setArtId] = useState(null);
  const [bioId, setBioId] = useState(null);

  // /#admin adresinde yönetim panelini aç
  const [isAdmin, setIsAdmin] = useState(() => window.location.hash === "#admin");
  useEffect(() => {
    const onHash = () => setIsAdmin(window.location.hash === "#admin");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // İçerik: önce yerel (fallback) listeyle başla, sonra Supabase'den çek.
  // Supabase kurulu değilse/erişilemezse yerel veriler görünür kalır.
  const [articles, setArticles] = useState(MAKALELER);
  const [felsefe, setFelsefe] = useState(FELSEFE);
  const [bios, setBios] = useState(BIO_DATA);
  const [konular, setKonular] = useState(KONULAR);
  useEffect(() => {
    getArticles().then((l) => { if (l && l.length) setArticles(l); }).catch(() => {});
    getFelsefe().then((l) => { if (l && l.length) setFelsefe(l); }).catch(() => {});
    getBios().then((l) => { if (l && l.length) setBios(l); }).catch(() => {});
    // Yeni bölüm: tamamen panelden yönetilir, bu yüzden boş liste de geçerlidir
    getKonular().then((l) => setKonular(l || [])).catch(() => {});
  }, []);

  if (isAdmin) return <Admin />;

  const go = (p) => { setPage(p); setBioId(null); setArtId(null); };
  const goArt = (id) => { setPrev(page); setArtId(id); setPage("article"); };
  const goBio = (id) => { setBioId(id); setPage("bio"); };

  const activeNav = page === "bio" ? "anarsizm" : page === "article" ? prev : page;
  const navItems = [
    { id: "home", label: "ANA SAYFA" },
    { id: "yazilar", label: "YAZILAR" },
    { id: "felsefe", label: "FELSEFE" },
    { id: "anarsizm", label: "ANARŞİZM" },
    { id: "konular", label: SEKME_ADI },
    { id: "hakkinda", label: "HAKKINDA" },
  ];

  const makale = articles.find(m => m.id === artId);
  const bio = bios.find(b => b.id === bioId);

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

      {page === "yazilar" && <Yazilar goArt={goArt} articles={articles} />}

      {page === "felsefe" && <Felsefe felsefe={felsefe} />}

      {page === "anarsizm" && <Anarsizm goBio={goBio} bios={bios} />}

      {page === "bio" && bio && <BioDetail bio={bio} onBack={() => go("anarsizm")} />}

      {page === "konular" && <Konular konular={konular} />}

      {page === "hakkinda" && <Hakkinda />}

      {page === "article" && makale && <Article makale={makale} go={go} prev={prev} />}

      <Footer />
    </div>
  );
}
