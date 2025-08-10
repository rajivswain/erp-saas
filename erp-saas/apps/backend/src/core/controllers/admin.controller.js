const { supabaseAdmin } = require('../../config/supabaseClient');

exports.listTenantUsers = async (req, res) => {
  try {
    const tenantId = req.tenantId; // set in adminOnly middleware
    const { data, error } = await supabaseAdmin.from('users').select('user_id, name, email, role').eq('tenant_id', tenantId);
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const tenantId = req.tenantId;
    const { userId, role } = req.body;
    const { data: u } = await supabaseAdmin.from('users').select('tenant_id').eq('user_id', userId).single();
    if (!u || u.tenant_id !== tenantId) return res.status(404).json({ error: 'User not found' });
    const { error } = await supabaseAdmin.from('users').update({ role }).eq('user_id', userId);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ message: 'Role updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
