# js-logger

Library used to interact with Sentry's Raven logging object

### Usage

```javascript
var JSLogger = require("js-logger");

var dsn = "";      // see https://docs.sentry.io/quickstart/#configure-the-dsn
var settings = {}; // see https://docs.sentry.io/clients/javascript/config/

var logger = new JSLogger(dsn, settings);

logger.loaded(function () {

  // do stuff

  // log stuff
  logger.log("testing", "warning");

});
```
