/**
 * Panoptes Researcher Dashboard run script
 * Run by invoking 'npm start'
 */
require('use-strict');

var express = require('express');
var app = express();
var httpServer = require('http').Server(app);
var env = process.env;

// Fetch configuration variables from package.json, or use sensible defaults
let makePath = (p) => __dirname + '/' + p;
let httpPort = env.npm_package_config_port || 8080;
let paths = {
  'modules': makePath(env.npm_package_config_paths_modules || 'node_modules'),
  'static': makePath(env.npm_package_config_paths_static || 'static'),
  'templates': makePath(env.npm_package_config_paths_templates || 'templates')
};

// Create and kick off API service
//var apiService = require('./app/api-service.js');
//apiService.start(app);

// Create and kick off web service
var webService = require('./app/web.js');
webService.start(app, paths);

// Set listening port for HTTP server
httpServer.listen(httpPort);
