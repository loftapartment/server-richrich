import bodyParser from 'body-parser';
import Express from 'express';
import { IUser } from './components';

export const app = Express();

app.disable('x-powered-by');

app.use(Express.static(`${__dirname}/public`));

app.use(bodyParser.json())

// load all routes
app.use(IUser.UserApi);
