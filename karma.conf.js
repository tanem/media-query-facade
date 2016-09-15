module.exports = (config) => {
  const karmaConfig = {
    browsers: ['Chrome'],
    singleRun: true,
    frameworks: ['browserify', 'tap'],
    files: [
      'lib/**/*.js',
      'test/**/*.js',
    ],
    preprocessors: {
      'lib/**/*.js': ['browserify', 'coverage'],
      'test/**/*.js': ['browserify'],
    },
    reporters: ['dots', 'coverage'],
    browserify: {
      debug: true,
      transform: ['babelify'],
    },
    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox'],
      },
    },
    coverageReporter: {
      type: 'text',
    },
  };

  if (process.env.TRAVIS) {
    karmaConfig.browsers = ['Chrome_travis_ci'];
  }

  config.set(karmaConfig);
};
