process.env.NODE_ENV = 'development';

const fs = require('fs-extra');
const paths = require('../config/paths');
const webpack = require('webpack');
const config = require('../config/webpack.config.dev.js');

var entry = config.entry;
var plugins = config.plugins;

entry = entry.filter(fileName => !fileName.match(/webpackHotDevClient/));
plugins = plugins.filter(plugin => !(plugin instanceof webpack.HotModuleReplacementPlugin));

config.entry = entry;
config.plugins = plugins;

webpack(config).watch({aggregateTimeout: 300, poll: 1000}, (err, stats) => {
    if (err) {
        console.error(err);
    } else {
        copyFolders();
    }
    console.error(stats.toString({
        chunks: false,
        colors: true
    }));
});

function copyFolders() {
    fs.copySync('/app/static', '/app/build/static', {
        dereference: true,
        filter: file => file !== paths.appHtml,
        overwite: true
    });
    fs.copySync('/app/index.html', '/app/build/index.html', {
        dereference: true,
        filter: file => file !== paths.appHtml,
        overwite: true
    });
}
