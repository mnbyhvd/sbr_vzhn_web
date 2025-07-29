import express, { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();
const router = express.Router();

// GET all vacancies
router.get('/', async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.query;
    let where: any = {};
    if (categoryId) {
      where.categoryId = Number(categoryId);
    }
    const vacancies = await prisma.vacancy.findMany({
      where,
      include: {
        category: true,
        responses: true,
      },
    });
    res.json(vacancies);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vacancies', error });
  }
});

// POST a new vacancy
router.post('/', async (req: Request, res: Response) => {
  const { title, description, requirements, textColor, bgColor, categoryId } = req.body;
  if (!title || !description || !requirements) {
    return res.status(400).json({ message: 'Title, description and requirements are required' });
  }
  try {
    const newVacancy = await prisma.vacancy.create({
      data: {
        title,
        description,
        requirements,
        textColor: textColor || '#222222',
        bgColor: bgColor || '#ffffff',
        categoryId: categoryId || null,
      },
    });
    res.status(201).json(newVacancy);
  } catch (error) {
    res.status(500).json({ message: 'Error creating vacancy', error });
  }
});

// PUT (update) a vacancy
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, requirements, textColor, bgColor, categoryId } = req.body;
  try {
    const updatedVacancy = await prisma.vacancy.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        requirements,
        textColor,
        bgColor,
        categoryId: categoryId || null,
      },
    });
    res.json(updatedVacancy);
  } catch (error) {
    res.status(500).json({ message: 'Error updating vacancy', error });
  }
});

// DELETE a vacancy
router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
  try {
    await prisma.vacancy.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting vacancy', error });
  }
  });

// Получить все категории вакансий
router.get('/categories', async (req: Request, res: Response) => {
  try {
    const categories = await prisma.vacancyCategory.findMany({
      orderBy: { name: 'asc' },
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при получении категорий', error });
  }
});

// Создать новую категорию вакансий
router.post('/categories', async (req: Request, res: Response) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Название обязательно' });
  }
  try {
    const category = await prisma.vacancyCategory.create({
      data: { name },
    });
    res.status(201).json(category);
  } catch (error: any) {
    if (error.code === 'P2002') {
      // Prisma: уникальное ограничение нарушено
      return res.status(409).json({ message: 'Категория с таким именем уже существует' });
    }
    res.status(500).json({ message: 'Ошибка при создании категории', error: error.message || error });
  }
});

// Получить одну вакансию по id
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const vacancy = await prisma.vacancy.findUnique({
      where: { id: Number(id) },
      include: {
        category: true,
        responses: true,
      },
    });
    if (!vacancy) {
      return res.status(404).json({ message: 'Vacancy not found' });
    }
    res.json(vacancy);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vacancy', error });
  }
});

// Получить все отклики на вакансию
router.get('/:id/responses', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const responses = await prisma.vacancyResponse.findMany({
      where: { vacancyId: Number(id) },
      orderBy: { createdAt: 'desc' },
    });
    res.json(responses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching responses', error });
  }
});

// Отклик на вакансию
router.post('/:id/responses', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, phone, message } = req.body;
  if (!name || !email || !phone || !message) {
    return res.status(400).json({ message: 'Все поля обязательны' });
  }
  try {
    const response = await prisma.vacancyResponse.create({
      data: {
        name,
        email,
        phone,
        message,
        vacancyId: Number(id),
      },
    });
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ message: 'Ошибка при создании отклика', error });
  }
});

export default router; 