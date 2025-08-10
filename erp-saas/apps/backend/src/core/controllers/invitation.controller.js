const { supabaseAdmin } = require('../../config/supabaseClient');
const { sendInvitationEmail } = require('../../utils/emailService');
const { generateTokenHex } = require('../../utils/helpers');

exports.invite = async (req, res) => {
  try {
    const authUserId = req.user?.id;
    const { data: me } = await supabaseAdmin.from('users').select('tenant_id').eq('auth_user_id', authUserId).single();
    const tenantId = me.tenant_id;
    const { email, role } = req.body;

    const token = generateTokenHex(32);
    const expires_at = new Date(Date.now() + 48*3600*1000).toISOString();

    const { data, error } = await supabaseAdmin.from('invitations').insert([{
      tenant_id: tenantId, email, role: role || 'user', token, expires_at
    }]).select().single();
    if (error) throw error;

    const link = `${process.env.FRONTEND_URL}/signup?token=${token}`;
    await sendInvitationEmail(email, link);

    res.json({ message: 'Invitation sent' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.accept = async (req, res) => {
  try {
    const { token, name, password } = req.body;
    const { data: invitation } = await supabaseAdmin.from('invitations').select('*').eq('token', token).eq('status', 'pending').maybeSingle();
    if (!invitation) return res.status(400).json({ error: 'Invalid or expired token' });
    if (new Date(invitation.expires_at) < new Date()) return res.status(400).json({ error: 'Expired' });

    // create supabase auth user using service role
    const { data: authUser, error: createAuthErr } = await supabaseAdmin.auth.admin.createUser({
      email: invitation.email,
      password,
      email_confirm: true
    });
    if (createAuthErr) throw createAuthErr;

    // insert into users table
    const { data: profile, error: profileErr } = await supabaseAdmin.from('users').insert([{
      auth_user_id: authUser.id,
      tenant_id: invitation.tenant_id,
      name,
      email: invitation.email,
      role: invitation.role
    }]).select().single();
    if (profileErr) throw profileErr;

    await supabaseAdmin.from('invitations').update({ status: 'accepted' }).eq('invitation_id', invitation.invitation_id);
    res.json({ message: 'Signup complete' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
