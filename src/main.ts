import './config';

import { app } from './app';
import { DbService } from './services/db';
import { Utility } from './helpers';
import { UserComponent } from './components';
import { DataCenter } from './services/data-center';
import { filter, take, concatMap } from 'rxjs/operators';

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

        DataCenter.ready$.pipe(
            filter(x => x === true),
            take(1),
            concatMap(async () => {
                // create default
                let user = new UserComponent.IModel.User();
                await user.queryByField({
                    equals: {
                        name: 'Admin'
                    }
                });
                if (!user.id) {
                    await UserComponent.UserController.signUp({
                        name: 'Admin',
                        email: 'admin@richrich.com',
                        password: process.env.ADMIN_DEFAULT_PW
                    }, UserComponent.IModel.ERole.Admin);

                    console.log('create default user');
                }
            })
        ).subscribe();

    } catch (error) {
        console.error(error);

        Utility.killServer();
    }
})();
