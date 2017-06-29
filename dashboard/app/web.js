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

  app.get('/project', function (req, res) {
    res.render('project.njk', {
      title: 'Individual Project Metrics'
    });
  });

  /*
  app.get('/trending', function (req, res) {
    res.send('Page does not exist yet :-(');
  });

  app.get('/images', function (req, res) {
    res.render('top-images.njk', {
      page: 'images',
      title: 'Popular Images'
    });
  });
  */
};

module.exports.start = start;
