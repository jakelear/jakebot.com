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
    date        = require('nunjucks-date'),
    dotenv      = require('dotenv'),
    bucketful   = require('bucketful');

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

// Initialize .env
dotenv.config();

// Setup s3 deploy config
var deploy_config = {
  source: config.build_dir,
  bucket: process.env.S3_BUCKET,
  awsKey: process.env.AWS_ACCESS_KEY_ID,
  awsSecret: process.env.AWS_SECRET_ACCESS_KEY
};

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

// Date formatter
date
  .setDefaultFormat('MMMM Do YYYY');

// Pass through a metadata variable indicating if the site is being served locally
// Check for livereload
if (process.env.SERVE) {
  metadata.serve = true;
}

// Local [Serve + Watch]
if (process.env.SERVE) {
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
}


// DEPLOY
if (process.env.DEPLOY) {
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
    .build(function (err) {
      if (err) {
        console.log(err)
      } else {
        // If the build succeeds
        console.log('Build complete');
        // Kick off bucketful deploy
        var conf = {};
        conf.output = process.stdout;
        conf.key = deploy_config.awsKey;
        conf.secret = deploy_config.awsSecret;
        conf.bucket = deploy_config.bucket;
        conf.source = deploy_config.source;
        bucketful.deploy(conf, function(err) {
          if(err) {
            console.log('Deploy failed');
          } else {
            console.log('Deploy successful');
          }
        });
      }
  });
}
