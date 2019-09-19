import * as winston from 'winston';

export function createLogger(): winston.Logger {
  return winston.createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(winston.format.colorize(), winston.format.simple())
      })
    ]
  });
}
