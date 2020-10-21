import * as dotenv from 'dotenv';
import { app } from './app';

const config = dotenv.config({
    path: './.env.dev',
});

let port: number = parseInt(process.env.PORT) || 3000;

app.listen(port, () => {
    console.log();
    console.log(`App running on port \u001b[33m${port}\u001b[0m...`);
});
