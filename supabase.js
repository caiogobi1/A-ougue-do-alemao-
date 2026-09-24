import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://keukcmiqznbxufbgriqw.supabase.co';
const supabaseKey = 'sb_publishable_8oMbNpnAXs0hOCG3q8QN3A_hJnxcU5I';

export const supabase = createClient(supabaseUrl, supabaseKey);
