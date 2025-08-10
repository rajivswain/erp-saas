const { supabaseAdmin } = require('../../config/supabaseClient');

exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    const { data, error } = await supabaseAdmin.from('tenants').insert([{ name }]).select().single();
    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.list = async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin.from('tenants').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
