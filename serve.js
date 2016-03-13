// Setup metalsmith plugins
var Metalsmith  = require('metalsmith'),
    markdown    = require('metalsmith-markdown'),
    permalinks  = require('metalsmith-permalinks'),
    branch      = require('metalsmith-branch'),
    collections = require('metalsmith-collections'),
    excerpts    = require('metalsmith-excerpts'),
    layouts     = require('metalsmith-layouts'),
    assets      = require('metalsmith-assets'),
    sass        = require('metalsmith-sass'),
    ignore      = require('metalsmith-ignore'),
    serve       = require('metalsmith-serve'),
    watch       = require('metalsmith-watch');

// Non metalsmith-specific modules
var nunjucks    = require('nunjucks'),
    date        = require('nunjucks-date');

// Basic metalsmith config
var config = {
  source_dir      : './src/content',
  build_dir       : './build',
  layouts_dir     : './src/layouts',
  layouts_engine  : 'nunjucks',
  assets: {
    source: './src/content/assets',
    destination: './assets'
  }
};


// Metadata gets passed through to site
var metadata = {
  title: 'Jakebot',
  url: 'http://jakebot.com',
  twitter_user: '@jakelear',
  fb_admin: '15601180'
};

metadata.serve = true;

// Template configuration
nunjucks
  .configure('./src/layouts')
  .addFilter('date', date);

// Date formatter
date
  .setDefaultFormat('MMMM Do YYYY');


Metalsmith(__dirname)
  .metadata(metadata)
  .use(markdown())
  .source(config.source_dir)
  .destination(config.build_dir)
  .use(sass({
    outputDir: 'css/'
  }))
  .use(
    layouts({
      engine: config.layouts_engine,
      directory: config.layouts_dir
    })
  )
  .use(ignore([
    'styles/**/*'
  ]))
  .use(assets(config.assets))
  .use(serve())
  .use(
    watch({
      paths: {
        "${source}/**/*": true,
        'src/layouts/**/*.html' : "**/*"
      },
        livereload: true,
    })
  )
  .build(function (err) {
    if (err) {
      console.log(err)
    } else {
      // If the build succeeds
      console.log('Build complete');
    }
  });
