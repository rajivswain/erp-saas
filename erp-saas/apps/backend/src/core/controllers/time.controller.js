// Time tracking controller example
const { supabaseAdmin } = require('../../config/supabaseClient');

exports.create = async (req, res) => {
  try {
    const { project, description, start_time, end_time } = req.body;
    const authUserId = req.user?.id;
    const { data: profile } = await supabaseAdmin.from('users').select('user_id, tenant_id').eq('auth_user_id', authUserId).single();
    if (!profile) return res.status(404).json({ error: 'Profile not found' });

    const payload = {
      user_id: profile.user_id,
      tenant_id: profile.tenant_id,
      project,
      description,
      start_time,
      end_time
    };
    const { data, error } = await supabaseAdmin.from('time_entries').insert([payload]).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.list = async (req, res) => {
  try {
    const authUserId = req.user?.id;
    const { data: profile } = await supabaseAdmin.from('users').select('user_id, tenant_id, role').eq('auth_user_id', authUserId).single();
    if (!profile) return res.status(404).json({ error: 'Profile not found' });

    let q = supabaseAdmin.from('time_entries').select('*').eq('tenant_id', profile.tenant_id);
    if (profile.role !== 'admin') q = q.eq('user_id', profile.user_id);

    const { data, error } = await q.order('start_time', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
