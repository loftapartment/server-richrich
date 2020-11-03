import express from 'express';
import { Utility } from '../../helpers';
import { Middleware } from '../../middlewares';
import { IUser } from './index';

const router = express.Router();
const _API_BASE = process.env.API_BASE;

router
    .route(`${_API_BASE}/user`)
    .get([Middleware.permission], async (req, res) => {
        let results: IUser.IUserR[] = await IUser.UserController.getAllUsers();

        results = Utility.removeRebundant(results);

        res.json(results);
    })
    .post()
    .put();

export const UserApi = router;
