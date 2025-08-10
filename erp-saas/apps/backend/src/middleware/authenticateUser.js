const { supabase } = require('../config/supabaseClient');

/**
 * Middleware: verifies Authorization: Bearer <token>
 * Uses Supabase public client to validate token's user
 * Sets req.user = { id, email, ... } if valid
 */
module.exports = async function authenticateUser(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ error: 'Missing Authorization header' });
    const token = header.replace('Bearer ', '').trim();
    if (!token) return res.status(401).json({ error: 'Missing token' });

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) return res.status(401).json({ error: 'Invalid token' });

    req.user = data.user; // { id: <uuid>, email, ... }
    next();
  } catch (err) {
    console.error('authenticateUser error', err);
    res.status(500).json({ error: 'Server error' });
  }
};
