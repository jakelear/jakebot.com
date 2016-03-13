var setup       = require('./setup'),
    serve       = require('metalsmith-serve'),
    watch       = require('metalsmith-watch');

// DEPLOY
setup.metalsmith
  .use(serve())
  .build(function (err) {
    if (err) {
      console.log(err)
    } else {
      // If the build succeeds
      console.log('Build complete');
    }
  });
