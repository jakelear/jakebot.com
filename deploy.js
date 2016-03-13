var setup       = require('./setup'),
    dotenv      = require('dotenv'),
    bucketful   = require('bucketful');

// Initialize .env
dotenv.config();

// Setup s3 deploy config
var deploy_config = {
  source: './build',
  bucket: process.env.S3_BUCKET,
  awsKey: process.env.AWS_ACCESS_KEY_ID,
  awsSecret: process.env.AWS_SECRET_ACCESS_KEY
};

// DEPLOY
setup.metalsmith.build(function (err) {
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
