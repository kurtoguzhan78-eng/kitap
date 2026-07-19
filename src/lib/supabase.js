import { createClient } from "@supabase/supabase-js";

// ⚠️ Bu iki değer HERKESE AÇIK (public) olacak şekilde tasarlanmıştır;
// güvenlik veritabanındaki RLS kurallarıyla sağlanır. Koda yazmak güvenlidir.
// ❗ "secret" anahtarını ASLA buraya yazma.
//
// URL projene göre hazır. SADECE publishable key'i yapıştırman gerekiyor
// (Supabase → Project Settings → API Keys → Publishable key → default → kopyala).

const SUPABASE_URL = "https://sxgnajmpsnelulronnya.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_fOQ9WGLXQ0I5ih_0wEaVKw_Q4WWHWFM"; // sb_publishable_... ile başlayan

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
