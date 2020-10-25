import Express from 'express';
import { IUser } from './components';

export const app = Express();

app.disable('x-powered-by');

app.use(Express.static(`${__dirname}/public`));

// load all routes
app.use(IUser.UserApi);
