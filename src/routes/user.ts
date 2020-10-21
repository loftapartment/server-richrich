import express from 'express';
import { Middleware } from '../middlewares';
import { User } from '../controllers';

const router = express.Router();

router.route('/').get(Middleware.permission, User.getAllUsers).post().put();

export const UserRouter = router;
