import express from 'express';
import type { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();
const router = express.Router();

// GET all partners
router.get('/', async (req: Request, res: Response) => {
  try {
    const partners = await prisma.partner.findMany({
      orderBy: { order: 'asc' }
    });
  res.json(partners);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching partners', error });
  }
});

// POST a new partner
router.post('/', async (req: Request, res: Response) => {
  const { name, logo, textColor, bgColor } = req.body;
  if (!name || !logo) {
    return res.status(400).json({ message: 'Name and logo are required' });
  }
  try {
    // Get the highest order number
    const lastPartner = await prisma.partner.findFirst({
      orderBy: { order: 'desc' }
    });
    const nextOrder = (lastPartner?.order ?? -1) + 1;

    const newPartner = await prisma.partner.create({
      data: {
        name,
        logo,
        textColor: textColor || '#222222',
        bgColor: bgColor || '#ffffff',
        order: nextOrder,
      },
    });
  res.status(201).json(newPartner);
  } catch (error) {
    res.status(500).json({ message: 'Error creating partner', error });
  }
});

// PUT (update) a partner
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, logo, textColor, bgColor } = req.body;
  try {
    const updatedPartner = await prisma.partner.update({
      where: { id: Number(id) },
      data: {
    name,
    logo,
        textColor,
        bgColor,
      },
    });
  res.json(updatedPartner);
  } catch (error) {
    res.status(500).json({ message: 'Error updating partner', error });
  }
});

// DELETE a partner
router.delete('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.partner.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting partner', error });
  }
});

// PATCH reorder partners
router.patch('/reorder', async (req: Request, res: Response) => {
  const { order } = req.body;
  if (!Array.isArray(order)) {
    return res.status(400).json({ message: 'Order array is required' });
  }
  try {
    await Promise.all(
      order.map(({ id, order: orderNum }) =>
        prisma.partner.update({
          where: { id: Number(id) },
          data: { order: orderNum },
        })
      )
    );
    res.json({ message: 'Partners reordered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error reordering partners', error });
  }
});

export default router; 