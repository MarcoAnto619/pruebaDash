import { createClient } from '@supabase/supabase-js'

console.log("=== REVISIÓN DE VARIABLES ===")
console.log("URL existe?:", !!process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log("KEY existe?:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
console.log("=============================")

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)