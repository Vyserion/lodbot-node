const winston = require('winston');
const fs = require('fs');

const plugins = {};

module.exports = {
    register: register,
    plugins: {}
};

function register() {
    var pluginNames = process.env.PLUGINS.split(",");

    for (var i = 0; i < pluginNames.length; i++) {
        var name = pluginNames[i];
        var path = 'plugins/' + name + '.js';

        if (fs.existsSync(path)) {
            var plugin = require('../plugins/' + name);
            plugins[name] = plugin;
            winston.log('info', 'Plugin \'' + name + '\' loaded.')
        } else {
            winston.log('warn', 'Plugin \'' + name + '\' not found inside the plugins folder.');
        }
    }

    module.exports.plugins = plugins;
}
