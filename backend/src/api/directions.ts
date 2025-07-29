import express, { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();
const router = express.Router();

// GET all directions
router.get('/', async (req: Request, res: Response) => {
  try {
    const directions = await prisma.direction.findMany({
      orderBy: [
        { order: 'asc' },
        { id: 'asc' },
      ],
    });
    res.json(directions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching directions', error });
  }
});

// POST a new direction
router.post('/', async (req: Request, res: Response) => {
  const { title, description, gridSize, textColor, bgColor } = req.body;
  if (!title || !description || gridSize === undefined) {
    return res.status(400).json({ message: 'Title, description and gridSize are required' });
  }
  try {
    const newDirection = await prisma.direction.create({
      data: {
    title,
    description,
    gridSize: Number(gridSize),
    textColor: textColor || '#222222',
        bgColor: bgColor || '#ffffff',
      },
    });
  res.status(201).json(newDirection);
  } catch (error) {
    res.status(500).json({ message: 'Error creating direction', error });
  }
});

// PUT (update) a direction
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, gridSize, textColor, bgColor, order } = req.body;
  try {
    const updatedDirection = await prisma.direction.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        gridSize: Number(gridSize),
        textColor,
        bgColor,
        order: typeof order === 'number' ? order : undefined,
      },
    });
    res.json(updatedDirection);
  } catch (error) {
    res.status(500).json({ message: 'Error updating direction', error });
  }
});

// DELETE a direction
router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
  try {
    await prisma.direction.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting direction', error });
  }
  });

export default router; 