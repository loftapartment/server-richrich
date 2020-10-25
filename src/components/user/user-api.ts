import express from 'express';
import { Middleware } from '../../middlewares';
import { IUser } from './index';

const router = express.Router();
const _API_BASE = process.env.API_BASE;

router
    .route(`${_API_BASE}/user`)
    .get([Middleware.permission], async (req, res) => {
        await IUser.UserController.getAllUsers();

        res.status(500).json({
            message: 'This route is not yet defined!',
        });
    })
    .post()
    .put();

export const UserApi = router;
