/**
 * Create a new logger
 * @param  {string} dsn      Public DSN (found in Sentry)
 * @param  {object} settings Optional config settings (https://docs.sentry.io/clients/javascript/config/)
 */
var Logger = function (dsn, settings) {

  settings = settings || {};
  Raven.config(dsn, settings).install();

};

Logger.prototype.loaded = function (func) {
  Raven.context(function () {
    func();
  });
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
