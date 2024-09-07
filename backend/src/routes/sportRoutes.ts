import { Router } from 'express';
import { getSportsByPlayground } from '../controllers/sportController';

const router = Router();

router.get('/:playgroundId/sports', getSportsByPlayground);

export default router;
