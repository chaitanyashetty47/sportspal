import { Router } from 'express';
import { getPlaygrounds,getTimingsByPlayground } from '../controllers/playgroundControllers';

const router = Router();

router.get('/', getPlaygrounds);
router.get('/:playgroundId/timings', getTimingsByPlayground);
export default router;
