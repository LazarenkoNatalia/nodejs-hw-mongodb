import express from 'express';
import pinoHTTP from 'pino-http';
import cors from 'cors';
import dotenv from "dotenv";
import { getAllContacts, getContactById } from './services/contacts.js';

dotenv.config();

const PORT = Number(process.env.PORT);

export const setupServer = () => {
    const app = express();

app.use(express.json());
  app.use(cors());


    const pino = pinoHTTP({
        transport: {
            target: 'pino-pretty',
        },
    });

    app.use(pino);


app.get('/contacts', async (req, res) => {
  try {
    const contacts = await getAllContacts();

      res.send({
          status: 200, data: contacts,
message: 'Successfully found contacts!'
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

app.get('/contacts/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const contact = await getContactById(id);

    if (contact === null) {
      return res
        .status(404)
        .send({ status: 404, message: 'Contact not found' });
    }

      res.send({
          status: 200, data: contact,
         message: `Successfully found contact with id **${id}**!`
     });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});



    app.get('/', (req, res) => {
        res.send('App contacts');
    },
    );

    app.use('*', (req, res, next) => {
        res.status(404).send({ status: 404, message: 'Not found' });
    });

    app.use((error, req, res, next) => {
        console.error(error);

        res.status(500).send({ status: 500, message: 'Internal Server Error' });
    });

    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`);
    });

}
    ;
