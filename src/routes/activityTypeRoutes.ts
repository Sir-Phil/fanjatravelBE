import { Router, Request, Response } from 'express';
import { activityOptions } from '../interface/activityOption';

const router = Router();

// Endpoint to get all activity types
router.get('/activity-types', (req: Request, res: Response) => {
  res.json({ success: true, activityTypes: activityOptions });
});

export default router;
