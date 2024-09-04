import 'dotenv/config';

import { initMongoConnection } from './db/initMongoConnection.js';

import { setupServer } from './server.js';
import { TEMP_DIR } from './constants/index.js';
import { createDirIfNotExist } from './utils/createDirIfNotExists.js';

async function bootstrap() {
  try {
    await initMongoConnection();
    await createDirIfNotExist(TEMP_DIR);
setupServer();

  } catch (error) {
    console.error(error);
  }
}

bootstrap();
