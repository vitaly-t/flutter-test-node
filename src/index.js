import express from 'express';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import router from './route';

const app = express();

app.use(morgan('dev'));
app.use(compression());
app.use(cors({ origin: '*' }));

app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.use(bodyParser.json());
app.use('/', router);

const server = app.listen(process.env.PORT || 9000, () => console.log(`Node Server listening on port 9000!`));

// export default app
