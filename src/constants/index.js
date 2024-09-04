import path from 'node:path';

export const FIFTEEN_MINUTES =  15 * 60 * 1000;
export const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

export const SMTP = {
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD,
  SMTP_FROM: process.env.SMTP_FROM,
  JWT_SECRET: process.env.JWT_SECRET,
  APP_DOMAIN: process.env.APP_DOMAIN
};

export const TEMP_DIR = path.join(process.cwd(), 'temp');
export const TEMPLATES_DIR = path.join(process.cwd(), 'src', 'templates');




