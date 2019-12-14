import { Service } from 'typedi';
import * as winston from 'winston';

@Service()
export class Logger {
  private readonly logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          )
        })
      ]
    });
  }

  public info(message: string, ...meta: unknown[]) {
    this.logger.info(message, meta);
  }

  public warn(message: string, ...meta: unknown[]) {
    this.logger.warn(message, meta);
  }

  public error(message: string, ...meta: unknown[]) {
    this.logger.error(message, meta);
  }
}
