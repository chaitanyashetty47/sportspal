import express from 'express';
import { createOrUpdateUser, getAllUsers } from '../controllers/userControllers';

const router = express.Router();

router.post('/', createOrUpdateUser);
router.get('/', getAllUsers);

export default router;