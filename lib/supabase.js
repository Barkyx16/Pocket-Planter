import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  "https://jlzjxyahwmoyqftkeuym.supabase.co";

const supabaseAnonKey =
  "sb_publishable_geCbimScUrDa-UxEjA91jQ_YeCMtMT2";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
