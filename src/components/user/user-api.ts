import express, { Request, Response } from 'express';
import { Utility } from '../../helpers';
import { Middleware } from '../../middlewares';
import { IUser } from './index';

const router = express.Router();
const _API_BASE = process.env.API_BASE;

export const UserApi = router;

router
    .route(`${_API_BASE}/user`)
    .get(
        [
            Middleware.permission
        ],
        async (req: Request, res: Response) => {
            try {
                let results: IUser.IModel.IResponse.IUserR[] = await IUser.UserController.getAllUsers();

                results = Utility.removeRebundant(results);

                res.json(results);
            } catch (error) {
                res.status(500).end(error);
            }
        });

router.route(`${_API_BASE}/user/sign-up`)
    .post(
        [
            Middleware.permission
        ],
        async (req: Request, res: Response) => {
            
        });




