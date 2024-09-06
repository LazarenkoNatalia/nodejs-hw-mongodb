import express from 'express';
import pinoHTTP from 'pino-http';
import cors from 'cors';
import dotenv from "dotenv";
// import router from './routers/contacts.js';
import rootRouter from './routers/index.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';
import cookieParser from 'cookie-parser';
import { swaggerDocs } from './middlewares/swaggerDocs.js';


dotenv.config();

const PORT = Number(process.env.PORT);

export const setupServer = () => {
    const app = express();

app.use(express.json());
  app.use(cors());
 app.use(cookieParser());

    const pino = pinoHTTP({
        transport: {
            target: 'pino-pretty',
        },
    });

    app.use(pino);

app.use('/api-docs', swaggerDocs());

    app.get('/', (req, res) => {
        res.send('App contacts');
    },
    );

    //    app.use(router);
     app.use(rootRouter);

  app.use('*', notFoundHandler);

  app.use(errorHandler);

    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`);
    });

}
    ;
