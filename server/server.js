import express from 'express';
import bodyParser from 'body-parser';
import router from './routes';

const app = express();

app.use(express.static('client'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
router(app);

export default app;
