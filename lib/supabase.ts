import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vbsixbjxnhmwemishfxa.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_munwcbQb6VaJQCWX-B14Xw_GkgkbP8x';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
