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
    sass        = require('metalsmith-sass'),
    ignore      = require('metalsmith-ignore'),
    serve       = require('metalsmith-serve'),
    watch       = require('metalsmith-watch'),
    dotenv      = require('dotenv')
    push        = require('metalsmith-push');

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

var s3_config = {
  bucket: process.env.S3_BUCKET,
  awsKey: process.env.AWS_ACCESS_KEY_ID,
  awsSecret: process.env.AWS_SECRET_ACCESS_KEY
};

var metadata = {
  title: 'Jakebot',
  url: 'http://jakebot.com',
  twitter_user: '@jakelear',
  fb_admin: '15601180'
};

dotenv.config();

nunjucks
  .configure('./src/layouts')
  .addFilter('date', date);

date
  .setDefaultFormat('MMMM Do YYYY');

if (process.env.SERVE) {
  metadata.serve = true;
}

if (process.env.DEPLOY) {
  Metalsmith(__dirname)
    .use(metalsmithPush({
      provider: 's3',
      s3: s3_config
    }))
    .build(function cb(err) {
      if(err) {
        console.err(err);
      }
    });
}

Metalsmith(__dirname)
  .metadata(metadata)
  .use(serve())
  .use(markdown())
  .source(config.source_dir)
  .destination(config.build_dir)
  .use(sass({
    outputDir: 'css/'   // This changes the output dir to "build/css/" instead of "build/scss/"
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
