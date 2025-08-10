// Auth controller: handles /auth signup & login endpoints
const authService = require('../services/auth.service');

exports.signup = async (req, res) => {
  try {
    const { email, password, name, tenant_name } = req.body;
    // For simplicity: if tenant_name provided, create/find tenant in tenants table (service role)
    // Here we create tenant if not exists using supabaseAdmin directly
    const { supabaseAdmin } = require('../../config/supabaseClient');

    // find tenant
    let tenantId = null;
    if (tenant_name) {
      const { data: found } = await supabaseAdmin.from('tenants').select('tenant_id').eq('name', tenant_name).maybeSingle();
      if (found) tenantId = found.tenant_id;
      else {
        const { data: newTenant, error: tErr } = await supabaseAdmin.from('tenants').insert([{ name: tenant_name }]).select().single();
        if (tErr) throw new Error(tErr.message);
        tenantId = newTenant.tenant_id;
      }
    }

    const user = await authService.signup({ email, password, name, tenant_id: tenantId });
    res.status(201).json({ message: 'Signup successful', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await authService.login({ email, password });
    // TODO: generate JWT or use Supabase session — returning user for now
    res.json({ message: 'Login successful', user });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};
