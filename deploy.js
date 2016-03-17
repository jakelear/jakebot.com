var setup       = require('./setup'),
    dotenv      = require('dotenv').config(),
    bucketful   = require('bucketful'),
    prompt      = require('prompt');

// Setup s3 deploy config
var deploy_config = {
  source: './build',
  bucket: process.env.S3_BUCKET,
  awsKey: process.env.AWS_ACCESS_KEY_ID,
  awsSecret: process.env.AWS_SECRET_ACCESS_KEY
};

var confirmDeploy = function(){
  prompt.start();
  // wait for user confirmation
  prompt.get({
    properties: {
      // setup the dialog
      confirm: {
          // allow yes, no, y, n, YES, NO, Y, N as answer
          pattern: /^(yes|no|y|n)$/gi,
          description: 'Are you sure you want to deploy?',
          message: 'y/n',
          required: true
      }
    }
  },  function (err, result){
      var c = result.confirm.toLowerCase();
      // yes or y typed ? otherwise abort
      if (c!='y' && c!='yes'){
          console.log('ABORT');
          return false;
      }
      // ugly callback here
      // TODO: maybe replace with promise if I need a promise lib somewhere
      deploy();
  });
}

var deploy = function() {
  // Kick off bucketful deploy
  var config = {};
  config.output = process.stdout;
  config.key = deploy_config.awsKey;
  config.secret = deploy_config.awsSecret;
  config.bucket = deploy_config.bucket;
  config.source = deploy_config.source;
  bucketful.deploy(config, function(err) {
    if(err) {
      console.log('Deploy failed');
    } else {
      console.log('Deploy successful');
    }
  });
};

// builds and attempts deploy
var buildAndDeploy = function(metalsmith) {
  metalsmith.build(function (err) {
    if (err) {
      console.log(err)
    } else {
      // If the build succeeds
      console.log('Build complete');
      confirmDeploy();
    }
  });
};

buildAndDeploy(setup.metalsmith);

