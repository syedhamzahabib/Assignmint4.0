import { Router } from 'express';

const router = Router();

router.get('/dashboard', (req, res) => {
  res.json({ message: 'Analytics dashboard endpoint' });
});

export default router;
