import express from 'express';
import bodyParser from 'body-parser';
import router from './routes';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
router(app);
app.get('/', (req, res) => res.status(200).send({ message: 'Welcome to the Homepage' }));

export default app;
