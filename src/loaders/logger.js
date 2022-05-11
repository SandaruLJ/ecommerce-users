"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
var winston_1 = __importDefault(require("winston"));
var Logger = /** @class */ (function () {
    function Logger() {
        this.transports = {
            logs: new winston_1.default.transports.File({
                filename: "./logs/logs.log",
                format: winston_1.default.format.combine(winston_1.default.format.timestamp({
                    format: 'DD-MM-YYYY HH:mm:ss'
                }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.splat(), winston_1.default.format.simple(), winston_1.default.format.colorize(), winston_1.default.format.json()),
            }),
            console: new winston_1.default.transports.Console({
                format: winston_1.default.format.combine(winston_1.default.format.errors({ stack: true }), winston_1.default.format.splat(), winston_1.default.format.simple()),
            }),
        };
        this.logger = winston_1.default.createLogger({
            levels: winston_1.default.config.npm.levels,
            transports: [
                this.transports.logs,
                this.transports.console
            ]
        });
    }
    Logger.getInstance = function () {
        if (Logger.instance === null) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    };
    Logger.prototype.info = function (msg) {
        this.logger.info(msg);
    };
    Logger.prototype.error = function (msg) {
        this.logger.error(msg);
    };
    Logger.prototype.warn = function (msg) {
        this.logger.warn(msg);
    };
    Logger.prototype.debug = function (msg) {
        this.logger.debug(msg);
    };
    Logger.prototype.silly = function (msg) {
        this.logger.silly(msg);
    };
    Logger.instance = null;
    return Logger;
}());
exports.Logger = Logger;
