import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import {
  getArticles,
  addArticle,
  updateArticle,
  deleteArticle,
  importArticles,
} from "../lib/articles";
import { RED } from "../constants";

const wrap = {
  minHeight: "100vh",
  background: "#0a0a0a",
  color: "#e8e8e8",
  fontFamily: "Georgia, 'Times New Roman', serif",
  padding: "40px 20px",
};
const box = { maxWidth: 820, margin: "0 auto" };
const input = {
  width: "100%",
  padding: "12px 14px",
  background: "#111",
  border: "1px solid #333",
  color: "#e8e8e8",
  fontSize: 15,
  marginBottom: 14,
  fontFamily: "inherit",
};
const label = {
  display: "block",
  fontSize: 12,
  letterSpacing: 1,
  textTransform: "uppercase",
  color: "#888",
  marginBottom: 6,
};
const btn = {
  padding: "11px 20px",
  background: RED,
  color: "#fff",
  border: "none",
  cursor: "pointer",
  fontSize: 14,
  letterSpacing: 0.5,
  fontFamily: "inherit",
};
const btnGhost = { ...btn, background: "transparent", border: "1px solid #444", color: "#ccc" };
const btnDanger = { ...btnGhost, borderColor: "#5a2020", color: "#c88" };
const backLink = { color: "#666", fontSize: 12, cursor: "pointer", background: "none", border: "none", padding: 0, fontFamily: "inherit" };

const toSite = () => {
  window.location.hash = "";
};

export default function Admin() {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authErr, setAuthErr] = useState("");

  const [list, setList] = useState([]);
  const [msg, setMsg] = useState("");
  const [editing, setEditing] = useState(null); // null | { mode, id, tag, date, title, desc, body }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) loadList();
  }, [session]);

  async function loadList() {
    try {
      setList(await getArticles());
    } catch (e) {
      setMsg("Liste yüklenemedi: " + e.message);
    }
  }

  async function login() {
    setAuthErr("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthErr("Giriş başarısız: " + error.message);
  }

  async function logout() {
    await supabase.auth.signOut();
  }

  function startNew() {
    setMsg("");
    setEditing({ mode: "new", id: "", tag: "", date: "", title: "", desc: "", body: "" });
  }

  function startEdit(a) {
    setMsg("");
    setEditing({
      mode: "edit",
      id: a.id,
      tag: a.tag,
      date: a.date,
      title: a.title,
      desc: a.desc,
      body: (a.body || []).join("\n\n"),
    });
  }

  async function save() {
    const e = editing;
    if (!e.id.trim() || !e.title.trim()) {
      setMsg("id ve başlık zorunlu.");
      return;
    }
    try {
      if (e.mode === "new") {
        await addArticle(e);
        setMsg("Yazı eklendi.");
      } else {
        await updateArticle(e.id, e);
        setMsg("Yazı güncellendi.");
      }
      setEditing(null);
      await loadList();
    } catch (err) {
      setMsg("Kaydedilemedi: " + err.message);
    }
  }

  async function remove(id) {
    if (!window.confirm("Bu yazı silinsin mi? (" + id + ")")) return;
    try {
      await deleteArticle(id);
      setMsg("Silindi.");
      await loadList();
    } catch (err) {
      setMsg("Silinemedi: " + err.message);
    }
  }

  async function doImport() {
    try {
      const n = await importArticles();
      setMsg(n + " yazı içe aktarıldı (var olanlara dokunulmadı).");
      await loadList();
    } catch (err) {
      setMsg("İçe aktarılamadı: " + err.message);
    }
  }

  if (!ready) {
    return (
      <div style={wrap}>
        <div style={box}>Yükleniyor…</div>
      </div>
    );
  }

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
          <input
            style={input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
          />
          {authErr && <div style={{ color: "#e77", fontSize: 13, marginBottom: 12 }}>{authErr}</div>}
          <button style={btn} onClick={login}>Giriş</button>
          <div style={{ marginTop: 20 }}>
            <button style={backLink} onClick={toSite}>← Siteye dön</button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- DÜZENLEYİCİ ----------
  if (editing) {
    const e = editing;
    const set = (k, v) => setEditing({ ...editing, [k]: v });
    return (
      <div style={wrap}>
        <div style={box}>
          <h1 style={{ fontSize: 20, marginBottom: 20 }}>
            {e.mode === "new" ? "Yeni Yazı" : "Yazıyı Düzenle"}
          </h1>
          <label style={label}>id (kısa etiket — ör: ideoloji, savas)</label>
          <input
            style={{ ...input, opacity: e.mode === "edit" ? 0.5 : 1 }}
            value={e.id}
            disabled={e.mode === "edit"}
            onChange={(ev) => set("id", ev.target.value)}
          />
          <label style={label}>Başlık</label>
          <input style={input} value={e.title} onChange={(ev) => set("title", ev.target.value)} />
          <label style={label}>Etiket (tag)</label>
          <input style={input} value={e.tag} onChange={(ev) => set("tag", ev.target.value)} />
          <label style={label}>Tarih</label>
          <input style={input} value={e.date} onChange={(ev) => set("date", ev.target.value)} />
          <label style={label}>Özet (kart altında görünen kısa açıklama)</label>
          <input style={input} value={e.desc} onChange={(ev) => set("desc", ev.target.value)} />
          <label style={label}>
            İçerik — paragrafları boş satırla ayır · alıntı için satır başına PULL: yaz
          </label>
          <textarea
            style={{ ...input, minHeight: 340, lineHeight: 1.6, resize: "vertical" }}
            value={e.body}
            onChange={(ev) => set("body", ev.target.value)}
          />
          {msg && <div style={{ color: "#9c9", fontSize: 13, marginBottom: 12 }}>{msg}</div>}
          <button style={btn} onClick={save}>Kaydet</button>{" "}
          <button
            style={btnGhost}
            onClick={() => {
              setEditing(null);
              setMsg("");
            }}
          >
            İptal
          </button>
        </div>
      </div>
    );
  }

  // ---------- LİSTE ----------
  return (
    <div style={wrap}>
      <div style={box}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 6,
          }}
        >
          <h1 style={{ fontSize: 22 }}>NOMASTER · Yönetim</h1>
          <div style={{ fontSize: 12, color: "#777" }}>
            {session.user.email}
            <button style={{ ...btnGhost, padding: "6px 12px", marginLeft: 10 }} onClick={logout}>
              Çıkış
            </button>
          </div>
        </div>
        <p style={{ marginBottom: 26 }}>
          <button style={backLink} onClick={toSite}>← Siteyi görüntüle</button>
        </p>

        <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
          <button style={btn} onClick={startNew}>+ Yeni Yazı</button>
          <button style={btnGhost} onClick={doImport}>Mevcut yazıları içe aktar</button>
        </div>
        {msg && <div style={{ color: "#9c9", fontSize: 13, marginBottom: 16 }}>{msg}</div>}

        <div>
          {list.length === 0 && (
            <div style={{ color: "#666", fontSize: 14 }}>
              Henüz yazı yok. “Mevcut yazıları içe aktar” ile başlayabilirsin.
            </div>
          )}
          {list.map((a) => (
            <div
              key={a.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "14px 0",
                borderBottom: "1px solid #1e1e1e",
                gap: 12,
              }}
            >
              <div>
                <div style={{ fontSize: 16 }}>{a.title}</div>
                <div style={{ fontSize: 12, color: "#666", marginTop: 3 }}>
                  {a.date} · {a.tag} · <span style={{ color: "#555" }}>{a.id}</span>
                </div>
              </div>
              <div style={{ whiteSpace: "nowrap" }}>
                <button style={{ ...btnGhost, padding: "7px 14px" }} onClick={() => startEdit(a)}>
                  Düzenle
                </button>{" "}
                <button style={{ ...btnDanger, padding: "7px 14px" }} onClick={() => remove(a.id)}>
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
