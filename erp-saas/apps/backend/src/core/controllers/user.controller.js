// User controller: profile, list users
const { supabaseAdmin } = require('../../config/supabaseClient');

exports.getProfile = async (req, res) => {
  try {
    const authUserId = req.user?.id; // set by authenticateUser middleware
    const { data, error } = await supabaseAdmin.from('users').select('user_id, email, name, role, tenant_id').eq('auth_user_id', authUserId).single();
    if (error) return res.status(404).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listUsers = async (req, res) => {
  try {
    // get tenant of current user, return all users in tenant
    const authUserId = req.user?.id;
    const { data: me } = await supabaseAdmin.from('users').select('tenant_id').eq('auth_user_id', authUserId).single();
    const { data, error } = await supabaseAdmin.from('users').select('user_id, name, email, role').eq('tenant_id', me.tenant_id);
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
