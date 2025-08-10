// Auth business logic: local password storage (for base module example)
// NOTE: In production you may prefer to use supabase.auth instead of rolling your own.
const { supabaseAdmin } = require('../../config/supabaseClient');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

/**
 * Create user row in 'users' table (server-side)
 * - stores email + hashed password
 * - returns inserted row
 */
async function signup({ email, password, name, tenant_id }) {
  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const { data, error } = await supabaseAdmin
    .from('users')
    .insert([{ email, password: hashed, name, tenant_id }])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

/**
 * Verify email/password against users table
 * returns user object if ok
 */
async function login({ email, password }) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
  if (error || !data) throw new Error('Invalid credentials');

  const valid = await bcrypt.compare(password, data.password);
  if (!valid) throw new Error('Invalid credentials');
  // In a real app generate a JWT here; we return user for now
  return { id: data.user_id, email: data.email, name: data.name, tenant_id: data.tenant_id, role: data.role };
}

module.exports = { signup, login };
