'use strict';

var path = require('path');
var conf = require('./gulp/conf');

var _ = require('lodash');
var wiredep = require('wiredep');

function listFiles() {
  var wiredepOptions = _.extend({}, conf.wiredep, {
    dependencies: true,
    devDependencies: true
  });

  return wiredep(wiredepOptions).js
    .concat([
      path.join(conf.paths.tmp, '/ng-rules.js'),
    ]);
}

module.exports = function(config) {

  var configuration = {
    files: listFiles(),

    singleRun: true,

    autoWatch: false,

    logLevel: 'WARN',

    frameworks: ['jasmine'],

    browsers : ['PhantomJS'],

    plugins : [
      'karma-phantomjs-launcher',
      'karma-coverage',
      'karma-coveralls',
      'karma-jasmine'
    ],

    coverageReporter: {
      type: 'lcov',
      dir: 'coverage',
      subdir: '.'
    },

    reporters: ['progress', 'coverage', 'coveralls']
  };

  // This is the default preprocessors configuration for a usage with Karma cli
  // The coverage preprocessor is added in gulp/unit-test.js only for single tests
  // It was not possible to do it there because karma doesn't let us now if we are
  // running a single test or not
  configuration.preprocessors = {};

  // This block is needed to execute Chrome on Travis
  // If you ever plan to use Chrome and Travis, you can keep it
  // If not, you can safely remove it
  // https://github.com/karma-runner/karma/issues/1144#issuecomment-53633076
  if(configuration.browsers[0] === 'Chrome' && process.env.TRAVIS) {
    configuration.customLaunchers = {
      'chrome-travis-ci': {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    };
    configuration.browsers = ['chrome-travis-ci'];
  }

  config.set(configuration);
};
