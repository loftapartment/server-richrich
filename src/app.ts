import bodyParser from 'body-parser';
import Express from 'express';
import { UserComponent } from './components';
import Cors from 'cors';

export const app = Express();

app.disable('x-powered-by');

app.use(Cors());

app.use(Express.static(`${__dirname}/public`));

app.use(bodyParser.json());

// load all routes
app.use(UserComponent.UserApi);

