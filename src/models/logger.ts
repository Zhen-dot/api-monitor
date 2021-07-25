// @ts-nocheck
import { ISettingsParam, Logger, TLogLevelName } from 'tslog';

const logLevel = process.env.LOG_LEVEL?.toLowerCase();
const minLevel: TLogLevelName = [
    'silly',
    'trace',
    'debug',
    'info',
    'warn',
    'error',
    'fatal',
].includes(logLevel)
    ? logLevel
    : undefined;

const settings: ISettingsParam = process.env.TEST_ENV
    ? {
          minLevel: minLevel ?? 'trace',
          displayFilePath: 'hideNodeModulesOnly',
          displayFunctionName: false,
          exposeErrorCodeFrame: true,
          dateTimeTimezone: 'Asia/Kuala_Lumpur',
          delimiter: '\t',
          prettyInspectOptions: {
              colors: true,
              compact: true,
              depth: 3,
          },
          jsonInspectOptions: {
              colors: true,
              compact: true,
              depth: 10,
          },
      }
    : {
          minLevel: minLevel ?? 'info',
          displayFilePath: 'hidden',
          displayFunctionName: false,
          exposeErrorCodeFrame: false,
          dateTimeTimezone: 'Asia/Kuala_Lumpur',
          delimiter: '\t',
          prettyInspectOptions: {
              colors: true,
              compact: true,
              depth: null,
          },
          jsonInspectOptions: {
              colors: true,
              compact: true,
              depth: null,
          },
      };

export default function logger(name: string, ...args: string[]): Logger {
    return new Logger({
        name,
        prefix: args ? args.map((s) => s.padEnd(8)) : undefined,
        ...settings,
    });
}
