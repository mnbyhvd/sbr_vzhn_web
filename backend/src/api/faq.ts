import express, { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();
const router = express.Router();

// GET all faqs
router.get('/', async (req: Request, res: Response) => {
  try {
    const faqs = await prisma.faq.findMany();
  res.json(faqs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching faqs', error });
  }
});

// POST a new faq
router.post('/', async (req: Request, res: Response) => {
  const { question, answer } = req.body;
  if (!question || !answer) {
    return res.status(400).json({ message: 'Question and answer are required' });
  }
  try {
    const newFaq = await prisma.faq.create({
      data: {
        question,
        answer,
      },
    });
  res.status(201).json(newFaq);
  } catch (error) {
    res.status(500).json({ message: 'Error creating faq', error });
  }
});

// PUT (update) a faq
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { question, answer } = req.body;
  try {
    const updatedFaq = await prisma.faq.update({
      where: { id: Number(id) },
      data: {
        question,
        answer,
      },
    });
  res.json(updatedFaq);
  } catch (error) {
    res.status(500).json({ message: 'Error updating faq', error });
  }
});

// DELETE a faq
router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
  try {
    await prisma.faq.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting faq', error });
  }
  });

export default router; 