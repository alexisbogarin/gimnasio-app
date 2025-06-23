// src/lib/supabaseClient.js

import { createClient } from '@supabase/supabase-js'

// Reemplaza con la URL y la Anon Key de tu proyecto de Supabase
const supabaseUrl = 'https://nkyzojeheyccrzqzumsh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5reXpvamVoZXljY3J6cXp1bXNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MTk0NTMsImV4cCI6MjA2NjI5NTQ1M30.JgEDW07JsLqBb5TRFwBrYfArq2WsAwaEa5l2KPJ6hH4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)