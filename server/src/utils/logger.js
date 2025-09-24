const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
};

class Logger {
  constructor() {
    this.isDevelopment = process.env.NODE_ENV !== "production";
  }

  formatMessage(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const prefix = `${timestamp} [${level.toUpperCase()}]`;

    let logMessage = `${prefix} ${message}`;

    if (data && typeof data === "object") {
      logMessage += ` ${JSON.stringify(data, null, 2)}`;
    } else if (data) {
      logMessage += ` ${data}`;
    }

    return logMessage;
  }

  colorize(text, color) {
    if (!this.isDevelopment) return text;
    return `${colors[color]}${text}${colors.reset}`;
  }

  info(message, data = null) {
    const logMessage = this.formatMessage("info", message, data);
    console.log(this.colorize(logMessage, "cyan"));
  }

  error(message, data = null) {
    const logMessage = this.formatMessage("error", message, data);
    console.error(this.colorize(logMessage, "red"));
  }

  warn(message, data = null) {
    const logMessage = this.formatMessage("warn", message, data);
    console.warn(this.colorize(logMessage, "yellow"));
  }

  debug(message, data = null) {
    if (!this.isDevelopment) return;
    const logMessage = this.formatMessage("debug", message, data);
    console.log(this.colorize(logMessage, "magenta"));
  }

  success(message, data = null) {
    const logMessage = this.formatMessage("success", message, data);
    console.log(this.colorize(logMessage, "green"));
  }

  // Log HTTP requests
  logRequest(req, res, responseTime) {
    const { method, url, ip } = req;
    const { statusCode } = res;

    let statusColor = "green";
    if (statusCode >= 400) statusColor = "red";
    else if (statusCode >= 300) statusColor = "yellow";

    const logMessage = `${method} ${url} ${statusCode} - ${responseTime}ms - ${ip}`;
    console.log(this.colorize(logMessage, statusColor));
  }

  // Log Socket.io events
  logSocket(event, socketId, data = null) {
    const message = `Socket ${event}: ${socketId}`;
    this.debug(message, data);
  }
}

const logger = new Logger();

module.exports = logger;
