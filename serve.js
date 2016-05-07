var setup       = require('./setup'),
    serve       = require('metalsmith-serve'),
    browsersync = require('metalsmith-browser-sync');

// SERVE
// TODO: Add some sort of watch
setup.metalsmith
  .use(serve())
  .use(browsersync({
    server : "build",
    files  : ["src/**/*"]
  }))
  .build(function (err) {
    if (err) {
      console.log(err)
    } else {
      // If the build succeeds
      console.log('Build complete');
    }
  });
