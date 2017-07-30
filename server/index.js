import dotenv from 'dotenv';
import app from './server';

dotenv.config();
/**
 * define port server will be running on.
 */
const port = process.env.PORT || 3000;

/**
 * start server
 */
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
