const expressWinston = require("express-winston");
const winston = require("winston");
const config = require("config");
const { transports } = require("winston");

const expwin = expressWinston.logger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.MongoDB({
      db: config.get("dbAdr"),
      options: { useUnifiedTopology: true },
      stroreHost: true,
      capped: true,
    }),
  ],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.metadata()
  ),
  meta: true,
  msg: "HTTP {{req.method}} {{req.url}}",
  expressFormat: true,
  colorize: false,
  ignoreRoute: function (req, res) {
    return false;
  },
});

const errwin = expressWinston.errorLogger({
  transports: [new transports.Console()],
  format: winston.format.combine(winston.format.prettyPrint()),
});

module.exports = { expwin, errwin };
