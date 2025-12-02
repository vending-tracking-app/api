export type EnvConfig = ReturnType<typeof envConfig>;

const REQUIRED_ENV_KEYS = [
  // Environment
  'NODE_ENV',
  'ENV_NAME',
  'PORT',
  // Database
  'DB_HOST',
  'DB_PORT',
  'DB_USERNAME',
  'DB_PASSWORD',
  'DB_NAME',
  // Better Auth
  'BETTER_AUTH_SECRET',
  'BETTER_AUTH_URL',
  // Frontend URL
  'FRONTEND_URL',
  // Default admin credentials
  'DEFAULT_ADMIN_EMAIL',
  'DEFAULT_ADMIN_PASSWORD',
] as const;

type RequiredEnvKeys = (typeof REQUIRED_ENV_KEYS)[number];

function getRequiredEnvVariables(): Record<RequiredEnvKeys, string> {
  const env = process.env as Record<RequiredEnvKeys, string | undefined>;

  for (const key of REQUIRED_ENV_KEYS) {
    if (env[key] === undefined) {
      throw new Error(`${key} is not set`);
    }
  }

  return env as Record<RequiredEnvKeys, string>;
}

export function envConfig() {
  const env = getRequiredEnvVariables();

  return {
    env: {
      nodeEnv: env.NODE_ENV,
      name: env.ENV_NAME,
      port: parseInt(env.PORT, 10),
    },
    database: {
      host: env.DB_HOST,
      port: parseInt(env.DB_PORT, 10),
      username: env.DB_USERNAME,
      password: env.DB_PASSWORD,
      name: env.DB_NAME,
    },
    betterAuth: {
      secret: env.BETTER_AUTH_SECRET,
      url: env.BETTER_AUTH_URL,
    },
    frontendUrl: env.FRONTEND_URL,
    defaultAdmin: {
      email: env.DEFAULT_ADMIN_EMAIL,
      password: env.DEFAULT_ADMIN_PASSWORD,
    },
  };
}
