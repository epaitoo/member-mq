import * as Joi from 'joi';

export const configuration = () => {
  return {
    environment: process.env.NODE_ENV,
    port: process.env.PORT,
    database: {
      user: process.env.DB_USER,
      name: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
      url: process.env.DATABASE_URL,
    },
    redis: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
    },
    jwtSecret: process.env.JWT_SECRET,
    refreshTokenSecret:
      process.env.REFRESH_JWT_TOKEN_SECRET,
    sms: {
      apiKey: process.env.SMS_API_KEY,
      baseUrl: process.env.SMS_PROVIDER_BASE_URL,
    },
  };
};

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .required(),
  PORT: Joi.number().required(),
  DB_USER: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_HOST: Joi.string().required(),
  DATABASE_URL: Joi.string().required(),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
  REDIS_PASSWORD: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  REFRESH_JWT_TOKEN_SECRET: Joi.string().required(),
  SMS_API_KEY: Joi.string(),
  SMS_PROVIDER_BASE_URL: Joi.string(),
});
