const config = require("config");

const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf, colorize } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

require("winston-mongodb");

let log;
const devLog = createLogger({
  format: combine(timestamp(), myFormat),
  transports: [
    new transports.Console({ level: "debug" }),
    new transports.File({ filename: "logs/errors.log", level: "error" }),
    new transports.File({ filename: "logs/combined.log", level: "info" }),
  ],
  exceptionHandlers: [new transports.File({ filename: "logs/exceptions.log" })],
  rejectionHandlers: [new transports.File({ filename: "logs/rejections.log" })],
});

const prodLog = createLogger({
  format: combine(timestamp(), myFormat),
  transports: [
    new transports.Console({ level: "debug" }),
    new transports.File({ filename: "logs/errors.log", level: "error" }),
    new transports.File({ filename: "logs/combined.log", level: "info" }),
  ],
  exceptionHandlers: [new transports.File({ filename: "logs/exceptions.log" })],
  rejectionHandlers: [new transports.File({ filename: "logs/rejections.log" })],
});

if (process.env.NODE_ENV == "production") {
  logger = prodLog;
} else {
  logger = devLog;
}

module.exports = logger;
