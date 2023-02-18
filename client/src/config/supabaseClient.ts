import { createClient } from '@supabase/supabase-js'
import { Database } from '../schema.types';
import 'react-native-url-polyfill/auto'

const supabaseUrl = 'https://bribdkfvyxbyercdbmch.supabase.co'//process.env.SUPABASE_URL;
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJyaWJka2Z2eXhieWVyY2RibWNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzI0ODM4NTEsImV4cCI6MTk4ODA1OTg1MX0.tZmG5Oh7x0kGqTZANYmyoosobp_-9D0M0-7Tb7hu0o4'//process.env.ANON_KEY;

const supabase = createClient<Database>((supabaseUrl), (supabaseKey));
export default supabase;