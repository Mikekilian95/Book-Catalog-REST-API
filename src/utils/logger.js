"use strict";
// This file defines the logging fucntions
// TODO: Logging levels for info, warning, and error logs
// Makes use of the Winston logger library to log messages to the console and a file
// Research was done on the Winston Logger library for best practices and usage
// I would normally just use the console.log() method to log messages to the console, but I wanted to use a more robust logging library for this project
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stream = void 0;
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
const env_1 = require("../config/env");
// Define log format
const logFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.splat(), winston_1.default.format.json());
// Define console format
const consoleFormat = winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.printf((_a) => {
    var { level, message, timestamp } = _a, meta = __rest(_a, ["level", "message", "timestamp"]);
    return `${timestamp} ${level}: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
}));
// Create logger
const logger = winston_1.default.createLogger({
    level: env_1.config.LOG_LEVEL || 'info',
    format: logFormat,
    defaultMeta: { service: 'book-api' },
    transports: [
        // - Write all logs to console
        new winston_1.default.transports.Console({
            format: consoleFormat,
        }),
    ],
});
// In production, write logs to files
if (env_1.config.NODE_ENV === 'production') {
    // - Write errors to error.log
    logger.add(new winston_1.default.transports.File({
        filename: path_1.default.join('logs', 'error.log'),
        level: 'error',
        maxsize: 5242880, // 5MB
        maxFiles: 5,
    }));
    // Write all logs to combined.log
    logger.add(new winston_1.default.transports.File({
        filename: path_1.default.join('logs', 'combined.log'),
        maxsize: 5242880, // 5MB
        maxFiles: 5,
    }));
}
// Create a stream object for Morgan HTTP logger
// This is used to log HTTP requests to the console and files
exports.stream = {
    write: (message) => {
        logger.info(message.trim());
    },
};
exports.default = logger;
