import { createClient } from "@supabase/supabase-js";

// ⚠️ BURAYI DEĞİŞTİR:
// Supabase projenden aldığın iki değeri buraya yapıştır (Settings → API).
// Bu iki değer HERKESE AÇIK (public) olmak için tasarlanmıştır; güvenlik
// veritabanındaki RLS politikalarıyla sağlanır. Bu yüzden koda yazmak
// ve GitHub'a push'lamak güvenlidir.
//
// ❗ "service_role" anahtarını ASLA buraya yazma — o gizli kalmalı.

const SUPABASE_URL = "https://SENIN-PROJEN.supabase.co";
const SUPABASE_ANON_KEY = "SENIN_ANON_PUBLIC_KEYIN";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
