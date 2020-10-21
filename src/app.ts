import { User } from 'controllers';
import Express from 'express';
import { UserRouter } from './routes';

const _API_BASE = '/api/v1';

export const app = Express();

app.disable('x-powered-by');

app.use(Express.static(`${__dirname}/public`));

// load all routes
app.use(`${_API_BASE}/user`, UserRouter);
