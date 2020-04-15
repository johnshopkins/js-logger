import * as Sentry from '@sentry/browser';

const isUserAgentToIgnore = () => {

  const ignoreUserAgents = ['Vivaldi', 'Firefox\/3\.6', 'PhantomJS', 'Pingdom.com_bot', 'QQBrowser', 'Chrome'];

  const pattern = new RegExp('(' + ignoreUserAgents.join('|') + ')');
  return pattern.test(window.navigator.userAgent);

};

const defaultInitOptions = {
  beforeSend: (event) => {

    if (isUserAgentToIgnore()) {
      return null;
    }

    return event;
  }
};

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
    const opts = { ...defaultInitOptions, ...options};
    Sentry.init(opts);
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
