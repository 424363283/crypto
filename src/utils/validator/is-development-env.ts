export function isDevelopmentEnv() {
  const env = process.env.DEBUG_ENV || process.env.NODE_ENV;
  return env !== undefined && env?.toLocaleLowerCase?.() !== 'production' && env?.toLocaleLowerCase?.() !== 'uat';
}
