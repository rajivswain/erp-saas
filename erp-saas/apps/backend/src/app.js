const express = require('express');
const cors = require('cors');
const authRoutes = require('./core/routes/auth.route');
const userRoutes = require('./core/routes/user.route');
const tenantRoutes = require('./core/routes/tenant.route');
const adminRoutes = require('./core/routes/admin.route');
const publicRoutes = require('./core/routes/public.route');
const loadPlugins = require('./pluginLoader');

const app = express();

app.use(cors());
app.use(express.json());

// Core mounted routes
app.use('/auth', authRoutes);   // /auth/signup /auth/login
app.use('/users', userRoutes);   // /users/me , /users
app.use('/tenants', tenantRoutes); // tenant endpoints (needs auth)
app.use('/admin', adminRoutes);  // admin-only operations
app.use('/public', publicRoutes); // public signing via invitation

// Load optional plugins (plugin folders in src/plugins)
loadPlugins(app);

// Health
app.get('/', (req, res) => res.json({ status: 'ok' }));

module.exports = app;
