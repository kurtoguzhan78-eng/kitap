import { supabase } from "./supabase";
import { MAKALELER } from "../data/makaleler";

// --- Dönüşümler ---------------------------------------------------------

// Metni paragraf dizisine böler (boş satır = yeni paragraf).
// "PULL:" ile başlayan paragraflar sitede alıntı olarak gösterilir.
function splitBody(text) {
  return (text || "")
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

// DB satırı -> uygulama objesi (sitenin beklediği şekil: body = dizi)
function fromRow(row) {
  return {
    id: row.id,
    tag: row.tag || "",
    date: row.date || "",
    title: row.title || "",
    desc: row.descr || "",
    body: splitBody(row.body),
  };
}

// Uygulama objesi -> DB satırı (body burada düz METİN olarak saklanır)
function toRow(a) {
  return {
    id: a.id,
    tag: a.tag,
    date: a.date,
    title: a.title,
    descr: a.desc,
    body: a.body, // textarea içeriği (düz metin)
  };
}

// --- Okuma --------------------------------------------------------------

export async function getArticles() {
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("sort_order", { ascending: false });
  if (error) throw error;
  return (data || []).map(fromRow);
}

// --- Yazma --------------------------------------------------------------

export async function addArticle(a) {
  const row = { ...toRow(a), sort_order: Date.now() }; // yeni yazı en üste
  const { error } = await supabase.from("articles").insert(row);
  if (error) throw error;
}

export async function updateArticle(id, a) {
  const row = toRow({ ...a, id }); // sort_order'a dokunma -> sıra korunur
  const { error } = await supabase.from("articles").update(row).eq("id", id);
  if (error) throw error;
}

export async function deleteArticle(id) {
  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) throw error;
}

// --- İlk kurulum: mevcut makaleleri veritabanına aktar ------------------
// data/makaleler.js içindeki yazıları tek seferde ekler.
// Zaten var olan id'lere DOKUNMAZ (ignoreDuplicates), yani panelden
// yaptığın düzenlemeler tekrar çalıştırsan bile bozulmaz.
export async function importArticles() {
  const total = MAKALELER.length;
  const rows = MAKALELER.map((a, i) => ({
    id: a.id,
    tag: a.tag,
    date: a.date,
    title: a.title,
    descr: a.desc,
    body: Array.isArray(a.body) ? a.body.join("\n\n") : a.body || "",
    sort_order: total - i, // mevcut sırayı korur
  }));
  const { error } = await supabase
    .from("articles")
    .upsert(rows, { onConflict: "id", ignoreDuplicates: true });
  if (error) throw error;
  return rows.length;
}
