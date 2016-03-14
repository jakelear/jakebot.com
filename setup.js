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
    metalsmith  = Metalsmith(__dirname);

// Non metalsmith-specific modules
var nunjucks    = require('nunjucks')
    date        = require('nunjucks-date-filter');

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

// Page collections like all pages or all posts
var site_collections = {
  posts: {
    pattern: 'posts/!(index).md',
    sortBy: 'date',
    reverse: true
  },
  pages: {
    pattern: '*.md',
    sortBy: 'position',
  }
}

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
  .configure('./src/layouts')
  .addFilter('date', date);
date
  .setDefaultFormat('MMMM Do, YYYY');

module.exports = {

  metalsmith: metalsmith
    .metadata(metadata)
    .use(sass({
      outputDir: 'css/'
    }))
    .source(config.source_dir)
    .destination(config.build_dir)
    .use(collections(site_collections))
    .use(markdown())
    .use(excerpts())
    .use(parseDate)
    .use(permalinks({
      pattern: "./:collection/:year/:month/:day/:title"
    }))
    .use(assets(config.assets))
    .use(
      layouts({
        engine: config.layouts_engine,
        directory: config.layouts_dir
      })
    )
}
