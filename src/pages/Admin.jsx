import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { getArticles, addArticle, updateArticle, deleteArticle, importArticles } from "../lib/articles";
import { getFelsefe, addFelsefe, updateFelsefe, deleteFelsefe, importFelsefe } from "../lib/felsefe";
import { getBios, addBio, updateBio, deleteBio, importBios } from "../lib/bios";
import { getKonular, addKonu, updateKonu, deleteKonu } from "../lib/konular";
import { RED, SEKME_ADI } from "../constants";

const wrap = { minHeight: "100vh", background: "#0a0a0a", color: "#e8e8e8", fontFamily: "Georgia, 'Times New Roman', serif", padding: "40px 16px" };
const box = { maxWidth: 820, margin: "0 auto" };
const input = { width: "100%", padding: "12px 14px", background: "#111", border: "1px solid #333", color: "#e8e8e8", fontSize: 15, marginBottom: 14, fontFamily: "inherit" };
const label = { display: "block", fontSize: 12, letterSpacing: 1, textTransform: "uppercase", color: "#888", marginBottom: 6 };
const btn = { padding: "11px 20px", background: RED, color: "#fff", border: "none", cursor: "pointer", fontSize: 14, letterSpacing: 0.5, fontFamily: "inherit" };
const btnGhost = { ...btn, background: "transparent", border: "1px solid #444", color: "#ccc" };
const btnDanger = { ...btnGhost, borderColor: "#5a2020", color: "#c88" };
const backLink = { color: "#666", fontSize: 12, cursor: "pointer", background: "none", border: "none", padding: 0, fontFamily: "inherit" };
const toSite = () => { window.location.hash = ""; };

const API = {
  yazilar: { get: getArticles, add: addArticle, update: updateArticle, del: deleteArticle, imp: importArticles },
  felsefe: { get: getFelsefe, add: addFelsefe, update: updateFelsefe, del: deleteFelsefe, imp: importFelsefe },
  biyografiler: { get: getBios, add: addBio, update: updateBio, del: deleteBio, imp: importBios },
  konular: { get: getKonular, add: addKonu, update: updateKonu, del: deleteKonu, imp: null },
};
const TABS = [
  { id: "yazilar", label: "Yazılar" },
  { id: "felsefe", label: "Felsefe" },
  { id: "biyografiler", label: "Biyografiler" },
  { id: "konular", label: SEKME_ADI },
];
const DISPLAY = {
  yazilar: { title: (a) => a.title, sub: (a) => `${a.date} · ${a.tag} · ${a.id}` },
  felsefe: { title: (a) => a.title, sub: (a) => a.id },
  biyografiler: { title: (a) => a.isim, sub: (a) => `${a.tarih} · ${a.etiket} · ${a.id}` },
  konular: { title: (a) => a.title || "(başlıksız)", sub: (a) => a.id },
};
// Hangi alan "zorunlu isim/başlık" sayılacak
const NAME_FIELD = { yazilar: "title", felsefe: "title", biyografiler: "isim", konular: "content" };
// Açılır bölüm (akordiyon) düzenleyicisi olan türler
const HAS_BOLUMLER = ["biyografiler"];

export default function Admin() {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authErr, setAuthErr] = useState("");

  const [tab, setTab] = useState("yazilar");
  const [lists, setLists] = useState({ yazilar: [], felsefe: [], biyografiler: [], konular: [] });
  const [msg, setMsg] = useState("");
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => { if (session) reloadAll(); }, [session]);

  async function reloadAll() {
    for (const t of Object.keys(API)) {
      try { const d = await API[t].get(); setLists((prev) => ({ ...prev, [t]: d })); }
      catch (e) { setMsg(t + " yüklenemedi: " + e.message); }
    }
  }
  async function reload(t) {
    try { const d = await API[t].get(); setLists((prev) => ({ ...prev, [t]: d })); }
    catch (e) { setMsg("Liste yüklenemedi: " + e.message); }
  }

  async function login() {
    setAuthErr("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthErr("Giriş başarısız: " + error.message);
  }
  async function logout() { await supabase.auth.signOut(); }

  function startNew() {
    setMsg("");
    if (tab === "yazilar") setEditing({ type: "yazilar", mode: "new", id: "", tag: "", date: "", title: "", desc: "", body: "" });
    else if (tab === "felsefe") setEditing({ type: "felsefe", mode: "new", id: "", title: "", content: "" });
    else if (tab === "biyografiler") setEditing({ type: "biyografiler", mode: "new", id: "", isim: "", tarih: "", etiket: "", ozet: "", bolumler: [] });
    else setEditing({ type: "konular", mode: "new", id: "", title: "", content: "" });
  }
  function startEdit(a) {
    setMsg("");
    if (tab === "yazilar") setEditing({ type: "yazilar", mode: "edit", id: a.id, tag: a.tag, date: a.date, title: a.title, desc: a.desc, body: (a.body || []).join("\n\n") });
    else if (tab === "felsefe") setEditing({ type: "felsefe", mode: "edit", id: a.id, title: a.title, content: a.content });
    else if (tab === "biyografiler") setEditing({ type: "biyografiler", mode: "edit", id: a.id, isim: a.isim, tarih: a.tarih, etiket: a.etiket, ozet: a.ozet, bolumler: (a.bolumler || []).map((b) => ({ ...b })) });
    else setEditing({ type: "konular", mode: "edit", id: a.id, title: a.title, content: a.content });
  }

  async function save() {
    const e = editing;
    const nameField = NAME_FIELD[e.type];
    const idOk = e.id && e.id.trim();
    const nameOk = e[nameField] && e[nameField].trim();
    if (!idOk || !nameOk) {
      setMsg("id ve " + (nameField === "content" ? "içerik" : nameField === "isim" ? "isim" : "başlık") + " zorunlu.");
      return;
    }
    try {
      if (e.mode === "new") { await API[e.type].add(e); setMsg("Eklendi."); }
      else { await API[e.type].update(e.id, e); setMsg("Güncellendi."); }
      setEditing(null);
      await reload(e.type);
    } catch (err) { setMsg("Kaydedilemedi: " + err.message); }
  }
  async function remove(t, id) {
    if (!window.confirm("Silinsin mi? (" + id + ")")) return;
    try { await API[t].del(id); setMsg("Silindi."); await reload(t); }
    catch (err) { setMsg("Silinemedi: " + err.message); }
  }
  async function doImport() {
    if (!API[tab].imp) return;
    try { const n = await API[tab].imp(); setMsg(n + " kayıt içe aktarıldı (var olanlara dokunulmadı)."); await reload(tab); }
    catch (err) { setMsg("İçe aktarılamadı: " + err.message); }
  }

  if (!ready) return <div style={wrap}><div style={box}>Yükleniyor…</div></div>;

  // ---------- GİRİŞ ----------
  if (!session) {
    return (
      <div style={wrap}>
        <div style={{ ...box, maxWidth: 380 }}>
          <h1 style={{ fontSize: 22, marginBottom: 4 }}>NOMASTER · Yönetim</h1>
          <p style={{ color: "#777", fontSize: 13, marginBottom: 24 }}>Devam etmek için giriş yap.</p>
          <label style={label}>E-posta</label>
          <input style={input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <label style={label}>Şifre</label>
          <input style={input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && login()} />
          {authErr && <div style={{ color: "#e77", fontSize: 13, marginBottom: 12 }}>{authErr}</div>}
          <button style={btn} onClick={login}>Giriş</button>
          <div style={{ marginTop: 20 }}><button style={backLink} onClick={toSite}>← Siteye dön</button></div>
        </div>
      </div>
    );
  }

  // ---------- DÜZENLEYİCİ ----------
  if (editing) {
    const e = editing;
    const set = (k, v) => setEditing({ ...editing, [k]: v });
    const setBolum = (i, k, v) => { const bl = editing.bolumler.map((b, j) => j === i ? { ...b, [k]: v } : b); setEditing({ ...editing, bolumler: bl }); };
    const addBolum = () => setEditing({ ...editing, bolumler: [...editing.bolumler, { baslik: "", icerik: "" }] });
    const delBolum = (i) => setEditing({ ...editing, bolumler: editing.bolumler.filter((_, j) => j !== i) });

    return (
      <div style={wrap}>
        <div style={box}>
          <h1 style={{ fontSize: 20, marginBottom: 20 }}>{e.mode === "new" ? "Yeni Kayıt" : "Düzenle"} — {TABS.find((t) => t.id === e.type).label}</h1>

          <label style={label}>id (kısa etiket, boşluksuz — ör: aforizma-1, devlet)</label>
          <input style={{ ...input, opacity: e.mode === "edit" ? 0.5 : 1 }} value={e.id} disabled={e.mode === "edit"} onChange={(ev) => set("id", ev.target.value)} />

          {e.type === "yazilar" && (<>
            <label style={label}>Başlık</label>
            <input style={input} value={e.title} onChange={(ev) => set("title", ev.target.value)} />
            <label style={label}>Etiket (tag)</label>
            <input style={input} value={e.tag} onChange={(ev) => set("tag", ev.target.value)} />
            <label style={label}>Tarih</label>
            <input style={input} value={e.date} onChange={(ev) => set("date", ev.target.value)} />
            <label style={label}>Özet</label>
            <input style={input} value={e.desc} onChange={(ev) => set("desc", ev.target.value)} />
            <label style={label}>İçerik — paragrafları boş satırla ayır · alıntı için satır başına PULL:</label>
            <textarea style={{ ...input, minHeight: 340, lineHeight: 1.6, resize: "vertical" }} value={e.body} onChange={(ev) => set("body", ev.target.value)} />
          </>)}

          {(e.type === "felsefe" || e.type === "konular") && (<>
            <label style={label}>Başlık{e.type === "konular" ? " (isteğe bağlı — boş bırakabilirsin)" : ""}</label>
            <input style={input} value={e.title} onChange={(ev) => set("title", ev.target.value)} />
            <label style={label}>İçerik — paragrafları boş satırla ayır</label>
            <textarea style={{ ...input, minHeight: 340, lineHeight: 1.6, resize: "vertical" }} value={e.content} onChange={(ev) => set("content", ev.target.value)} />
          </>)}

          {HAS_BOLUMLER.includes(e.type) && (<>
            <label style={label}>{e.type === "biyografiler" ? "İsim" : "Başlık"}</label>
            <input style={input} value={e.type === "biyografiler" ? e.isim : e.baslik}
              onChange={(ev) => set(e.type === "biyografiler" ? "isim" : "baslik", ev.target.value)} />
            <label style={label}>Tarih (solda görünen küçük yazı — boş bırakılabilir)</label>
            <input style={input} value={e.tarih} onChange={(ev) => set("tarih", ev.target.value)} />
            <label style={label}>Etiket (sağda görünen küçük yazı)</label>
            <input style={input} value={e.etiket} onChange={(ev) => set("etiket", ev.target.value)} />
            <label style={label}>Özet (listede ve detay başında görünür)</label>
            <textarea style={{ ...input, minHeight: 90, lineHeight: 1.6, resize: "vertical" }} value={e.ozet} onChange={(ev) => set("ozet", ev.target.value)} />

            <div style={{ marginTop: 10, marginBottom: 10, borderTop: "1px solid #222", paddingTop: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ ...label, marginBottom: 0 }}>Bölümler (tıklayınca açılan başlıklar)</span>
                <button style={{ ...btnGhost, padding: "6px 12px" }} onClick={addBolum}>+ Bölüm ekle</button>
              </div>
              {e.bolumler.length === 0 && <div style={{ color: "#666", fontSize: 13, marginBottom: 12 }}>Henüz bölüm yok.</div>}
              {e.bolumler.map((b, i) => (
                <div key={i} style={{ border: "1px solid #222", padding: 14, marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: "#777" }}>Bölüm {i + 1}</span>
                    <button style={{ ...btnDanger, padding: "5px 10px" }} onClick={() => delBolum(i)}>Bölümü sil</button>
                  </div>
                  <label style={label}>Bölüm başlığı</label>
                  <input style={input} value={b.baslik} onChange={(ev) => setBolum(i, "baslik", ev.target.value)} />
                  <label style={label}>Bölüm içeriği — paragrafları boş satırla ayır</label>
                  <textarea style={{ ...input, minHeight: 160, lineHeight: 1.6, resize: "vertical", marginBottom: 0 }} value={b.icerik} onChange={(ev) => setBolum(i, "icerik", ev.target.value)} />
                </div>
              ))}
            </div>
          </>)}

          {msg && <div style={{ color: "#9c9", fontSize: 13, marginBottom: 12 }}>{msg}</div>}
          <button style={btn} onClick={save}>Kaydet</button>{" "}
          <button style={btnGhost} onClick={() => { setEditing(null); setMsg(""); }}>İptal</button>
        </div>
      </div>
    );
  }

  // ---------- LİSTE ----------
  const list = lists[tab] || [];
  const disp = DISPLAY[tab];
  return (
    <div style={wrap}>
      <div style={box}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, flexWrap: "wrap", gap: 10 }}>
          <h1 style={{ fontSize: 22 }}>NOMASTER · Yönetim</h1>
          <div style={{ fontSize: 12, color: "#777" }}>
            {session.user.email}
            <button style={{ ...btnGhost, padding: "6px 12px", marginLeft: 10 }} onClick={logout}>Çıkış</button>
          </div>
        </div>
        <p style={{ marginBottom: 20 }}><button style={backLink} onClick={toSite}>← Siteyi görüntüle</button></p>

        <div style={{ display: "flex", gap: 8, marginBottom: 22, borderBottom: "1px solid #222", flexWrap: "wrap" }}>
          {TABS.map((t) => (
            <button key={t.id} onClick={() => { setTab(t.id); setMsg(""); }}
              style={{ padding: "10px 16px", background: "none", border: "none", borderBottom: tab === t.id ? "2px solid " + RED : "2px solid transparent", color: tab === t.id ? "#fff" : "#888", cursor: "pointer", fontSize: 15, fontFamily: "inherit" }}>
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
          <button style={btn} onClick={startNew}>+ Yeni</button>
          {API[tab].imp && <button style={btnGhost} onClick={doImport}>Mevcut içeriği içe aktar</button>}
        </div>
        {msg && <div style={{ color: "#9c9", fontSize: 13, marginBottom: 16 }}>{msg}</div>}

        <div>
          {list.length === 0 && <div style={{ color: "#666", fontSize: 14 }}>Henüz kayıt yok. "+ Yeni" ile ekleyebilirsin.</div>}
          {list.map((a) => (
            <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid #1e1e1e", gap: 12, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: 16 }}>{disp.title(a)}</div>
                <div style={{ fontSize: 12, color: "#666", marginTop: 3 }}>{disp.sub(a)}</div>
              </div>
              <div style={{ whiteSpace: "nowrap" }}>
                <button style={{ ...btnGhost, padding: "7px 14px" }} onClick={() => startEdit(a)}>Düzenle</button>{" "}
                <button style={{ ...btnDanger, padding: "7px 14px" }} onClick={() => remove(tab, a.id)}>Sil</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
