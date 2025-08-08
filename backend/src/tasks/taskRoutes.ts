import { Router } from 'express';

const router = Router();

// Task routes
router.get('/', (req, res) => {
  res.json({ message: 'Get tasks endpoint' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create task endpoint' });
});

router.get('/:id', (req, res) => {
  res.json({ message: 'Get task by ID endpoint' });
});

router.put('/:id', (req, res) => {
  res.json({ message: 'Update task endpoint' });
});

router.delete('/:id', (req, res) => {
  res.json({ message: 'Delete task endpoint' });
});

export default router;
