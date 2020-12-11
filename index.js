import * as Sentry from '@sentry/browser';

const defaultLogOptions = {
  level: 'info',
  extras: {},
  tags: {}
};

export default class Logger {

  /**
   * Constructor
   * @param  {object} settings Options (https://docs.sentry.io/error-reporting/configuration/?platform=browser)
   */
  constructor (options) {
    Sentry.init(options);
  }

  /**
   * Log an error to Sentry
   * Available levels: fatal, error, warning, info
   * @param  {string/exception} error   String or exception that defines the error
   * @param  {object}           options Level, tag, and extra data to send to Sentry
   */
  log (error, options) {

    const opts = { ...defaultLogOptions, ...options};

    Sentry.withScope(scope => {
      scope.setExtras(opts.data);
      scope.setTags(opts.tags);
  
      if (typeof error === 'string') {
        scope.setLevel(opts.level);
        Sentry.captureMessage(error);
      } else {
        Sentry.captureException(error);
      }
    });

  }

};
