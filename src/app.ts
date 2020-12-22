import bodyParser from 'body-parser';
import CookieParser from 'cookie-parser';
import Express from 'express';
import { UserComponent } from './components';
import Cors from 'cors';

export const app = Express();

app.disable('x-powered-by');

app.use(Cors());

app.use(Express.static(`${__dirname}/public`));

app.use(bodyParser.json());

app.use(CookieParser());

// load all routes
app.use(UserComponent.UserApi);

