# Fruitworld.WebUI

###First run

To run Angular Seed Project Gulp you will need a node instaled in your environment. If you don't have a node.js please go to this site http://nodejs.org and download and install proper version.

Next you will need to install gulp

`npm install -g gulp`

Next you will need to install bower

`npm install -g bower`

And after that go to Angular Seed Project Gulp and run those commands to get all dependencies:`

`npm install`
`bower install`

##Notice: To inject kendoUI CSS, you need modified bower.json, add extra css fields to `main` property

 ` "main": ["js/kendo.all.min.js","styles/kendo.common.min.css","styles/kendo.flat.min.css","styles/kendo.dataviz.flat.min.css","styles/kendo.flat.mobile.min.css"]`


####Gulp file is based on angular gulp generator (https://github.com/Swiip/generator-gulp-angular). There are few main task that you can do:

- `gulp` or `gulp build` to build an optimized version of your application in /dist
- `gulp serve` to launch a browser sync server on your source files
- `gulp serve:dist` to launch a server on your optimized application
- `gulp test` to launch your unit tests with Karma
- `gulp test:auto` to launch your unit tests with Karma in watch mode
- `gulp protractor` to launch your e2e tests with Protractor
- `gulp protractor:dist` to launch your e2e tests with Protractor on the dist files
