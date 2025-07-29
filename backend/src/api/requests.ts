import express, { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();
const router = express.Router();

// GET all requests
router.get('/', async (req: Request, res: Response) => {
  try {
    const requests = await prisma.request.findMany();
  res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requests', error });
  }
});

// POST a new request
router.post('/', async (req: Request, res: Response) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email and message are required' });
  }
  try {
    const newRequest = await prisma.request.create({
      data: {
    name,
    email,
    message,
      },
    });
  res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error creating request', error });
  }
});

// DELETE a request
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.request.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting request', error });
  }
});

export default router; 