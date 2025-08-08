import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Get offers endpoint' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create offer endpoint' });
});

export default router;
