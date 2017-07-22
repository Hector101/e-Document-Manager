import express from 'express';
import bodyParser from 'body-parser';

const app = express();


/**
 * @description parse application/x-www-form-urlencoded
 *  @description parse application/json
 */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

export default app;
