import express from 'express';
import bodyParser from 'body-parser';
import router from './routes';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
router(app);

app.get('/', (req, res) => {
  res.status(200).send('Welcome to the home page');
});

export default app;
