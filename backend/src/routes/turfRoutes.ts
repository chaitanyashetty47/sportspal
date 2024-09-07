import { Router } from 'express';
import { getTurfsByPlayground, getTurfsForPlaygroundAndSport} from '../controllers/turfController';

const router = Router();

router.get('/:playgroundId/turfs', getTurfsByPlayground);
router.get('/:playgroundId/turfs/:sportType', getTurfsForPlaygroundAndSport);


export default router;
