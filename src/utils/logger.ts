import winston from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';
import { fileURLToPath } from 'url';

// === ESModules __dirname setup ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === Winston base config ===
const { combine, timestamp, printf, align, colorize, label: setLabel } = winston.format;

const customLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

winston.addColors({
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue'
});

// === Formato personalizado con label y opcional color ===
const buildFormat = (labelValue: string, useColor: boolean) =>
  combine(
    setLabel({ label: labelValue }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    align(),
    ...(useColor ? [colorize()] : []),
    printf(({ timestamp, level, message, label }) => {
      const paddedLabel = (label as string).padEnd(15);
      const paddedLevel = level.padEnd(7);
      return `[${timestamp}] [${paddedLabel}] ${paddedLevel}: ${message}`;
    })
  );

// === Función principal para obtener loggers por módulo ===
export const getLogger = (label: string) => {
  const dailyRotateTransport = new winston.transports.DailyRotateFile({
    filename: path.join(__dirname, '..', 'logs', `LOGS-%DATE%.log`),
    datePattern: 'YYYY-MM-DD',
    maxSize: '10m',
    maxFiles: '14d',
    level: 'info',
    format: buildFormat(label, false),
    auditFile: path.join(__dirname, '..', 'logs', 'meta', 'winston-audit.json')
  });

  const consoleTransport = new winston.transports.Console({
    level: 'debug',
    format: buildFormat(label, true) // con color para consola
  });

  return winston.createLogger({
    levels: customLevels,
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    transports: [consoleTransport, dailyRotateTransport],
  });
};
