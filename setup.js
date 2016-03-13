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
    serve       = require('metalsmith-serve');

// Non metalsmith-specific modules
var nunjucks    = require('nunjucks');

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

// Parsedate from http://deve.rs/blog/2014/4/building-a-blog-with-metalsmith/
function parseDate(files, metalsmith, done) {
  for(var file in files) {
    if(files[file].date) {
      var date = new Date(files[file].date);
      files[file].year = date.getUTCFullYear();
      files[file].month = date.getUTCMonth()+1;
      files[file].day = date.getUTCDate();
    }
  }
  done();
}

// Metadata gets passed through to site
var metadata = {
  title: 'Jakebot',
  url: 'http://jakebot.com',
  twitter_user: '@jakelear',
  fb_admin: '15601180'
};

// Template configuration
nunjucks
  .configure('./src/layouts');

module.exports = {
  metalsmith: Metalsmith(__dirname)
  .use(markdown())
  .use(ignore([
    'styles/**/*',
    'posts/drafts/**'
  ]))
  .use(parseDate)
  .use(collections({
    pages: {
      pattern: "pages/*.md"
    },
    posts: {
      pattern: "posts/*.md",
      sortyBy: "date",
      reverse: true
    }
  }))
  .use(permalinks({
    pattern: "./:collection/:year/:month/:day/:title"
  }))
  .metadata(metadata)
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
  .use(assets(config.assets))
}
