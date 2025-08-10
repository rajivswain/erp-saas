// Create Supabase clients: public (anon) and admin (service role) for server side tasks
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Public client (limited) - can be used for non-privileged checks if needed
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Admin client (service role) - DO NOT expose in frontend
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

module.exports = { supabase, supabaseAdmin };
