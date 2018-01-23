var expect = require("chai").expect;
var assert = require("chai").assert;

var Logger = require("../index");

// mock Raven

global.Raven = {
  config: function (dsn, settings) { return Raven; },
  install: function () {}
};

// mock window
global.window = {
  navigator: {
    userAgent: null
  }
};

describe("Logger constructor", function () {

  it("throw an error when DSN is not provided", function () {

    var wrapper = function () {
      return new Logger();
    };

    expect(wrapper).to.throw(Error, "DSN not provided to Logger object");

  });

  it("Assign provided DSN, default settings", function () {

    var dsn = "blahblahblah";
    var logger = new Logger(dsn);
    logger.run();

    var defaults = logger.defaultSettings();

    expect(logger.dsn).to.equal(dsn);
    expect(logger.settings.ignoreErrors).to.deep.equal(defaults.ignoreErrors);

    // this is weird, but explained well here: https://github.com/chaijs/chai/issues/896#issuecomment-270007014
    // to get around this, i'm making sure the string representation of the functions are the same
    expect(logger.settings.shouldSendCallback.toString()).to.equal(defaults.shouldSendCallback.toString());

  });

  it("Assign envirnoment", function () {

    var dsn = "blahblahblah";
    var env = "local";

    var settings = { environment: env };
    var logger = new Logger(dsn, settings);
    logger.run();

    var expected = logger.defaultSettings();
    expected.environment = env;

    expect(logger.settings.environment).to.equal(env);

  });

  it("Assign envirnoment, overrids default settings", function () {

    var dsn = "blahblahblah";
    var env = "local";

    var settings = {
      environment: env,
      ignoreErrors: [],
      shouldSendCallback: null
    };
    var logger = new Logger(dsn, settings);
    logger.run();

    expect(logger.settings).to.deep.equal(settings);

  });

});

describe("shouldSendCallback()", function () {

  var logger = new Logger("blahblahblah");
  var shouldSendCallback = logger.defaultSettings().shouldSendCallback;

  it("Should return false give PhantomJS user agent", function () {

    global.window.navigator.userAgent = "Mozilla/5.0 (Unknown; Linux x86_64) AppleWebKit/534.34 (KHTML, like Gecko) PhantomJS/1.9.8 Safari/534.34";
    expect(shouldSendCallback()).to.be.false;

  });

  it("Should return false give Firefox 3.6.* user agent", function () {

    global.window.navigator.userAgent = "	Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.2.11) Gecko/20101012 Firefox/3.6.11";
    expect(shouldSendCallback()).to.be.false;

    global.window.navigator.userAgent = "	Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.9.2.11) Gecko/20101012 Firefox/3.6";
    expect(shouldSendCallback()).to.be.false;

  });

  it("Should return false give Vivaldi user agent", function () {

    global.window.navigator.userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.102 Safari/537.36 Vivaldi/1.94.971.8";
    expect(shouldSendCallback()).to.be.false;

  });

  it("Should return false given a Pingdom user agent", function () {

    global.window.navigator.userAgent = "Pingdom.com_bot";
    expect(shouldSendCallback()).to.be.false;

  });

  it("Should return false given a QQBrowesr user agent", function () {

    global.window.navigator.userAgent = "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; WOW64; Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; Core/1.53.2050.400 QQBrowser/9.5.10218.400)";
    expect(shouldSendCallback()).to.be.false;

  });

});
