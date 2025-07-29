import { PrismaClient } from '../generated/prisma';
import { Router } from 'express';

const prisma = new PrismaClient();
const router = Router();

// Получить все записи международного опыта
router.get('/', async (req, res) => {
  try {
    const experiences = await prisma.internationalExperience.findMany({
      orderBy: { order: 'asc' }
    });
    res.json(experiences);
  } catch (error) {
    console.error('Error fetching international experience:', error);
    res.status(500).json({ error: 'Failed to fetch international experience' });
  }
});

// Создать новую запись
router.post('/', async (req, res) => {
  try {
    const { title, details, order } = req.body;
    const experience = await prisma.internationalExperience.create({
      data: {
        title,
        details,
        order: order || 0
      }
    });
    res.json(experience);
  } catch (error) {
    console.error('Error creating international experience:', error);
    res.status(500).json({ error: 'Failed to create international experience' });
  }
});

// Обновить запись
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, details, order } = req.body;
    const experience = await prisma.internationalExperience.update({
      where: { id: parseInt(id) },
      data: {
        title,
        details,
        order
      }
    });
    res.json(experience);
  } catch (error) {
    console.error('Error updating international experience:', error);
    res.status(500).json({ error: 'Failed to update international experience' });
  }
});

// Удалить запись
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.internationalExperience.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'International experience deleted successfully' });
  } catch (error) {
    console.error('Error deleting international experience:', error);
    res.status(500).json({ error: 'Failed to delete international experience' });
  }
});

export default router; 