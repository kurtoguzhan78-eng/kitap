import { supabase } from "./supabase";

// DB satırı -> uygulama objesi
// (veritabanında sütun adı "baslik", uygulamada "title" olarak kullanılır)
function fromRow(r) {
  return {
    id: r.id,
    title: r.baslik || "",
    content: r.content || "",
  };
}

export async function getKonular() {
  const { data, error } = await supabase
    .from("konular")
    .select("*")
    .order("sort_order", { ascending: false });
  if (error) throw error;
  return (data || []).map(fromRow);
}

export async function addKonu(k) {
  const row = { id: k.id, baslik: k.title, content: k.content, sort_order: Date.now() };
  const { error } = await supabase.from("konular").insert(row);
  if (error) throw error;
}

export async function updateKonu(id, k) {
  const row = { baslik: k.title, content: k.content }; // sort_order'a dokunma -> sıra korunur
  const { error } = await supabase.from("konular").update(row).eq("id", id);
  if (error) throw error;
}

export async function deleteKonu(id) {
  const { error } = await supabase.from("konular").delete().eq("id", id);
  if (error) throw error;
}
