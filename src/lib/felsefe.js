import { supabase } from "./supabase";
import { FELSEFE } from "../data/felsefe";

export async function getFelsefe() {
  const { data, error } = await supabase
    .from("felsefe")
    .select("*")
    .order("sort_order", { ascending: false });
  if (error) throw error;
  return (data || []).map((r) => ({
    id: r.id,
    title: r.title || "",
    content: r.content || "",
  }));
}

export async function addFelsefe(f) {
  const row = { id: f.id, title: f.title, content: f.content, sort_order: Date.now() };
  const { error } = await supabase.from("felsefe").insert(row);
  if (error) throw error;
}

export async function updateFelsefe(id, f) {
  const row = { title: f.title, content: f.content };
  const { error } = await supabase.from("felsefe").update(row).eq("id", id);
  if (error) throw error;
}

export async function deleteFelsefe(id) {
  const { error } = await supabase.from("felsefe").delete().eq("id", id);
  if (error) throw error;
}

// data/felsefe.js içindeki yazıları tek seferde veritabanına aktar.
// Zaten var olanlara dokunmaz.
export async function importFelsefe() {
  const total = FELSEFE.length;
  const rows = FELSEFE.map((f, i) => ({
    id: f.id,
    title: f.title,
    content: f.content,
    sort_order: total - i,
  }));
  const { error } = await supabase
    .from("felsefe")
    .upsert(rows, { onConflict: "id", ignoreDuplicates: true });
  if (error) throw error;
  return rows.length;
}
