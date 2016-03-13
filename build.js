var Metalsmith  = require('metalsmith'),
    markdown    = require('metalsmith-markdown'),
    permalinks  = require('metalsmith-permalinks'),
    branch      = require('metalsmith-branch'),
    collections = require('metalsmith-collections'),
    excerpts    = require('metalsmith-excerpts'),
    layouts     = require('metalsmith-layouts'),
    nunjucks    = require('nunjucks'),
    date        = require('nunjucks-date'),
    assets      = require('metalsmith-assets'),
    serve       = require('metalsmith-serve'),
    watch       = require('metalsmith-watch');

var config = {
  source_dir      : './src/content',
  build_dir       : './build',
  layouts_dir     : './src/layouts',
  layouts_engine  : 'nunjucks',
  assets: {
    source: './src/content/assets',
    destination: './assets'
  }
}

var metadata = {
  title: 'Jakebot',
  url: 'http://jakebot.com',
  twitter_user: '@jakelear',
  fb_admin: '15601180'
};

nunjucks
  .configure('./src/layouts')
  .addFilter('date', date);

date
  .setDefaultFormat('MMMM Do YYYY');

if (process.env.SERVE) {
  metadata.serve = true;
}

Metalsmith(__dirname)
  .metadata(metadata)
  .clean(true)
  .use(serve())
  .use(markdown())
  .source(config.source_dir)
  .destination(config.build_dir)
  .use(
    layouts({
      engine: config.layouts_engine,
      directory: config.layouts_dir
    })
  )
  .use(assets(config.assets))
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
      console.log('Build complete')
    }
  })
