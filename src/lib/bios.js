import { supabase } from "./supabase";
import { BIO_DATA } from "../data/bioData";

// DB satırı -> uygulama objesi (bolumler jsonb olarak gelir/gider)
function fromRow(r) {
  return {
    id: r.id,
    isim: r.isim || "",
    tarih: r.tarih || "",
    etiket: r.etiket || "",
    ozet: r.ozet || "",
    bolumler: Array.isArray(r.bolumler) ? r.bolumler : [],
  };
}

function toRow(b) {
  return {
    id: b.id,
    isim: b.isim,
    tarih: b.tarih,
    etiket: b.etiket,
    ozet: b.ozet,
    bolumler: b.bolumler || [],
  };
}

export async function getBios() {
  const { data, error } = await supabase
    .from("bios")
    .select("*")
    .order("sort_order", { ascending: false });
  if (error) throw error;
  return (data || []).map(fromRow);
}

export async function addBio(b) {
  const row = { ...toRow(b), sort_order: Date.now() };
  const { error } = await supabase.from("bios").insert(row);
  if (error) throw error;
}

export async function updateBio(id, b) {
  const row = toRow({ ...b, id });
  const { error } = await supabase.from("bios").update(row).eq("id", id);
  if (error) throw error;
}

export async function deleteBio(id) {
  const { error } = await supabase.from("bios").delete().eq("id", id);
  if (error) throw error;
}

// data/bioData.js içindeki biyografileri tek seferde veritabanına aktar.
// Zaten var olanlara dokunmaz.
export async function importBios() {
  const total = BIO_DATA.length;
  const rows = BIO_DATA.map((b, i) => ({
    id: b.id,
    isim: b.isim,
    tarih: b.tarih,
    etiket: b.etiket,
    ozet: b.ozet,
    bolumler: b.bolumler || [],
    sort_order: total - i,
  }));
  const { error } = await supabase
    .from("bios")
    .upsert(rows, { onConflict: "id", ignoreDuplicates: true });
  if (error) throw error;
  return rows.length;
}
