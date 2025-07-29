import express, { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();
const router = express.Router();

// GET all team members
router.get('/', async (req: Request, res: Response) => {
  try {
    const teamMembers = await prisma.teamMember.findMany({
      orderBy: { order: 'asc' }
    });
  res.json(teamMembers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching team members', error });
  }
});

// POST a new team member
router.post('/', async (req: Request, res: Response) => {
  const { name, role, image, textColor, bgColor } = req.body;
  if (!name || !role || !image) {
    return res.status(400).json({ message: 'Name, role and image are required' });
  }
  try {
    // Get the highest order number
    const lastMember = await prisma.teamMember.findFirst({
      orderBy: { order: 'desc' }
    });
    const nextOrder = (lastMember?.order ?? -1) + 1;

    const newMember = await prisma.teamMember.create({
      data: {
        name,
        role,
        image,
        textColor: textColor || '#222222',
        bgColor: bgColor || '#ffffff',
        order: nextOrder,
      },
    });
  res.status(201).json(newMember);
  } catch (error) {
    res.status(500).json({ message: 'Error creating team member', error });
  }
});

// PUT (update) a team member
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, role, image, textColor, bgColor } = req.body;
  try {
    const updatedMember = await prisma.teamMember.update({
      where: { id: Number(id) },
      data: {
    name,
    role,
    image,
        textColor,
        bgColor,
      },
    });
  res.json(updatedMember);
  } catch (error) {
    res.status(500).json({ message: 'Error updating team member', error });
  }
});

// DELETE a team member
router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
  try {
    await prisma.teamMember.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting team member', error });
  }
  });

// PATCH reorder team members
router.patch('/reorder', async (req: Request, res: Response) => {
  const { order } = req.body;
  if (!Array.isArray(order)) {
    return res.status(400).json({ message: 'Order array is required' });
  }
  try {
    await Promise.all(
      order.map(({ id, order: orderNum }) =>
        prisma.teamMember.update({
          where: { id: Number(id) },
          data: { order: orderNum },
        })
      )
    );
    res.json({ message: 'Team members reordered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error reordering team members', error });
  }
});

export default router; 