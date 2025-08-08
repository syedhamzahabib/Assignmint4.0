import { Router } from 'express';

const router = Router();

router.get('/users', (req, res) => {
  res.json({ message: 'Admin get users endpoint' });
});

export default router;
