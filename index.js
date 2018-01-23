/**
 * Create a new logger
 * @param  {string} dsn      Public DSN (found in Sentry)
 * @param  {string} env      Environment
 * @param  {object} settings Optional config settings (https://docs.sentry.io/clients/javascript/config/)
 */
var Logger = function (dsn, settings) {

  if (!dsn) throw new Error("DSN not provided to Logger object");

  this.dsn = dsn;
  this.settings = settings || {};

};

/**
 * Default user agents to ignore
 * @type {Array}
 */
Logger.prototype.ignoreUserAgents = [
  "Vivaldi",
  "gsa-crawler",
  "Firefox\/3\.6",
  "PhantomJS",
  "Pingdom.com_bot",
  "QQBrowser"
];

/**
 * Setup default settings and load Raven
 * @return self
 */
Logger.prototype.run = function () {

  this.addDefaultSettings();

  Raven.config(this.dsn, this.settings).install();

  return this;

};

/**
 * Wrap your application start
 * @param  {function} func Function to run once Raven.context is called
 * @return {[type]}        null
 */
Logger.prototype.loaded = function (func) {

  if (typeof func !== "function") {
    throw new Error("Object passed to Logger.loaded is not a function.");
  }

  Raven.context(function () {
    func();
  });
};

Logger.prototype.defaultSettings = function () {

  var ignoreUserAgents = this.ignoreUserAgents;

  return {

    ignoreErrors: [

      // Random plugins/extensions
      "top.GLOBALS",

      // coming from this tutorial on iPhone app dev: http://www.icab.de/blog/2010/07/11/customize-the-contextual-menu-of-uiwebview/
      "MyAppGetHTMLElementsAtPoint",
      "MyAppGetLinkHREFAtPoint"

    ],

    /**
     * Do not log errors from user agents that match
     * strings in this.ignoreUserAgents
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    shouldSendCallback: function (data) {

      if (ignoreUserAgents.length === 0) return true;

      var agent = window.navigator.userAgent;
      var pattern = new RegExp("(" + ignoreUserAgents.join("|") + ")");

      return !(pattern.test(window.navigator.userAgent));

    }

  };
};

/**
 * Added default settings if they do not
 * exist in passed settings.
 * @return null
 */
Logger.prototype.addDefaultSettings = function () {

  var defaults = this.defaultSettings();

  for (var key in defaults) {
    if (!this.settings[key]) {
      this.settings[key] = defaults[key];
    }
  }

};

/**
 * Log a message to Sentry
 * @param  {string} message Message to log
 * @param  {string} level   Message level: 'info', 'warning', or 'error'
 * @param  {object} data    Additional logging data ({ key: value })
 */
Logger.prototype.log = function (message, level, data) {

  if (!message) return;

  data = data || {};

  Raven.captureMessage(message, {
    level: level || "info",
    extra: data
  });

};

module.exports = Logger;
