import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wkmjyzrkrquuiazomiwz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrbWp5enJrcnF1dWlhem9taXd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5MDQ3MzAsImV4cCI6MjA4ODQ4MDczMH0.C1rvG9KPo2XGrN35VSyartPuZwlvrxBjpeDwUQ7_xms'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
