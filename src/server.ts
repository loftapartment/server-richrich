import { app } from './app';
import { DbService } from './services';
import { Utility } from './helpers';

let port: number = parseInt(process.env.PORT) || 3000;

(async () => {
    try {
        await DbService.connect();

        console.log();
        console.log(`connected to MongoDB \u001b[34m${DbService.baseUrl}\u001b[0m`);

        app.listen(port, () => {
            console.log();
            console.log(`app running on port \u001b[33m${port}\u001b[0m...`);
            console.log();
        });
    } catch (error) {
        console.error(error);

        Utility.killServer();
    }
})();
