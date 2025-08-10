const fs = require('fs');
const path = require('path');

/**
 * Loads plugins dynamically from src/plugins directory.
 * Each plugin folder must export index.js with `register(app)` function.
 */
function loadPlugins(app) {
  const pluginsPath = path.join(__dirname, 'plugins');
  if (!fs.existsSync(pluginsPath)) return;

  fs.readdirSync(pluginsPath).forEach(pluginName => {
    const pluginDir = path.join(pluginsPath, pluginName);
    if (!fs.lstatSync(pluginDir).isDirectory()) return;

    try {
      const plugin = require(path.join(pluginDir, 'index.js'));
      if (plugin && typeof plugin.register === 'function') {
        plugin.register(app);
        console.log(`✅ Loaded plugin: ${pluginName}`);
      } else {
        console.warn(`⚠️ Plugin ${pluginName} missing register(app)`);
      }
    } catch (err) {
      console.error(`❌ Failed to load plugin ${pluginName}: ${err.message}`);
    }
  });
}

module.exports = loadPlugins;
