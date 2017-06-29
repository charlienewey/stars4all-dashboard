var express = require('express');
var njk = require('nunjucks');

// configure the templating engine
njk.configure({
  autoescape: true,
  watch: true
});

function start(app, paths) {
  // set up template path, configure app
  let fsl = new njk.FileSystemLoader(paths.templates);
  let njkEnv = new njk.Environment(fsl);
  njkEnv.express(app);

  // set up static paths
  app.use('/modules', express.static(paths.modules));
  app.use('/static', express.static(paths.static));

  // set up web interface routes
  app.get('/', function (req, res) {
    res.render('index.njk', {
      title: 'Citizen Science Project Health'
    });
  });

  app.get('/project/all', function (req, res) {
    let proj = 'All Projects';
    res.render('project.njk', {
      project: proj,
      slug: 'all',
      title: 'Project Metrics for ' + proj
    });
  });

  app.get('/project/darkskies', function (req, res) {
    let proj = 'DarkSkies';
    res.render('project.njk', {
      project: proj,
      slug: proj,
      title: 'Project Metrics for ' + proj
    });
  });

  app.get('/project/lostatnight', function (req, res) {
    let proj = 'LostAtNight';
    res.render('project.njk', {
      project: proj,
      slug: proj,
      title: 'Project Metrics for ' + proj
    });
  });

  app.get('/project/nightcities', function (req, res) {
    let proj = 'NightCities';
    res.render('project.njk', {
      project: proj,
      slug: proj,
      title: 'Project Metrics for ' + proj
    });
  });

  app.get('/project/nightknights', function (req, res) {
    let proj = 'NightKnights';
    res.render('project.njk', {
      project: proj,
      slug: proj,
      title: 'Project Metrics for ' + proj
    });
  });
};

module.exports.start = start;
