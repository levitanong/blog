var config = require('./webpack-base.config.js')({
	prod: false,
  prerender: false
});

module.exports = config;
