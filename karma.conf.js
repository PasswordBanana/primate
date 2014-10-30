// Karma configuration
// Generated on Tue Oct 28 2014 12:32:46 GMT+1000 (AEST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'app/js/libpwsafejs/jDataView/jquery/jquery-1.7.1-binary-ajax.js',
      'app/js/libpwsafejs/jDataView/src/jdataview.js',
      'app/js/libpwsafejs/jDataView/src/jdataview-jquery-converter.js',
      'app/js/libpwsafejs/crypto-sha256-hmac.js',
      'app/js/libpwsafejs/twofish.js',
      'app/js/libpwsafejs/pwsafedb.js',
      'app/bower_components/jquery/dist/jquery.min.js',
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/bower_components/angular-animate/angular-animate.min.js',
      'bower_components/angular-strap/dist/angular-strap.min.js',
      'bower_components/angular-strap/dist/angular-strap.tpl.min.js',
      'app/bower_components/bootstrap/dist/js/bootstrap.min.js',
      'app/js/app.js',
      'app/js/factories.js',
      'app/js/filters.js',
      'app/js/controllers.js',
      'app/bower_components/zxcvbn/zxcvbn.js',
      'app/bower_components/fuse.js/src/fuse.js',
      'app/bower_components/file-saver/FileSaver.js',
      'app/**/test.*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Firefox', 'PhantomJS', 'Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
