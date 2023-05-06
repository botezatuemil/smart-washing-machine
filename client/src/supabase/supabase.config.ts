import { SUPABASE_URL, API_KEY } from "@env";
import { createClient } from "@supabase/supabase-js";
import 'react-native-url-polyfill/auto'

const supabase = createClient(SUPABASE_URL, API_KEY);

export default supabase;