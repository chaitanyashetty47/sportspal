import { Router } from 'express';
import { getPlaygrounds,getTimingsByPlayground,getPlaygroundDetails } from '../controllers/playgroundControllers';

const router = Router();

router.get('/', getPlaygrounds);
router.get('/:playgroundId/timings', getTimingsByPlayground);
router.get('/:playgroundId/',getPlaygroundDetails)

export default router;
