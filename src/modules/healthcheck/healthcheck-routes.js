import { Router } from 'express';
import { getHealthcheck } from './healthcheck-controller.js';

const router = Router();

router.get('/_healthcheck', getHealthcheck);

export default router;
