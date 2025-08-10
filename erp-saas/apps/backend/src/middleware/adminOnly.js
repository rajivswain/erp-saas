const { supabaseAdmin } = require('../config/supabaseClient');

/**
 * Middleware: ensures current auth user is an admin inside their tenant.
 * - Finds users table row where auth_user_id == req.user.id
 * - Checks role === 'admin'
 * - Adds req.tenantId and req.userProfile for downstream use
 */
module.exports = async function adminOnly(req, res, next) {
  try {
    const authUserId = req.user?.id;
    if (!authUserId) return res.status(401).json({ error: 'Unauthorized' });

    const { data, error } = await supabaseAdmin.from('users').select('user_id, tenant_id, role').eq('auth_user_id', authUserId).single();
    if (error || !data) return res.status(403).json({ error: 'Access denied' });
    if (data.role !== 'admin') return res.status(403).json({ error: 'Admin only' });

    req.tenantId = data.tenant_id;
    req.userProfile = data;
    next();
  } catch (err) {
    console.error('adminOnly error', err);
    res.status(500).json({ error: 'Server error' });
  }
};
