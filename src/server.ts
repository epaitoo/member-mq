require('dotenv').config();
import app from './app';
import config from 'config';

const PORT = config.get<number>('port');


if (!PORT) {
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
