## My personal site and blog: Jakebot.com

I use [metalsmith](http://www.metalsmith.io/) as a static site generator. I'm a big fan of its flexibility.
This site uses a pretty standard metalsmith setup with nunjucks templating.

### How it works

Metalsmith runs on node, so that's a dependency.

There are three tasks: setup, serve, and deploy. [Setup](https://github.com/jakelear/jakebot.com/blob/master/setup.js) is the primary metalsmith workhorse, used by both of the other tasks. [Serve](https://github.com/jakelear/jakebot.com/blob/master/serve.js) is for use in the development environment and will serve the site locally and initialize [browsersync](https://www.browsersync.io/) to watch and livereload. [Deploy](https://github.com/jakelear/jakebot.com/blob/master/deploy.js) is for pushing the site to s3 and uses [bucketful](https://github.com/jakobmattsson/bucketful) - I wrote about how I set this up for [easy s3 deployment of metalsmith sites.](http://jakebot.com/posts/2016/3/14/deploying-to-s3-with-metalsmith-and-bucketful/)


### License

The MIT License (MIT)

Copyright © 2016, Jake Lear

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
