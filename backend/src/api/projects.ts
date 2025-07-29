import express, { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();
const router = express.Router();

// GET all projects
router.get('/', async (req: Request, res: Response) => {
  try {
    const { directionId, client, search } = req.query;
    let where: any = {};
    if (client) {
      where.client = { contains: String(client), mode: 'insensitive' };
    }
    if (search) {
      const s = String(search);
      where.OR = [
        { title: { contains: s, mode: 'insensitive' } },
        { description: { contains: s, mode: 'insensitive' } },
        { client: { contains: s, mode: 'insensitive' } },
        { industry: { contains: s, mode: 'insensitive' } },
        { technologies: { contains: s, mode: 'insensitive' } },
        { details: { contains: s, mode: 'insensitive' } },
      ];
    }
    if (directionId) {
      // directionId может быть строкой или массивом
      const ids = Array.isArray(directionId) ? directionId.map(Number) : [Number(directionId)];
      where.directions = {
        some: {
          directionId: { in: ids }
        }
      };
    }
    const projects = await prisma.project.findMany({
      where,
      include: {
        directions: {
          include: { direction: true }
        }
      },
      orderBy: { id: 'asc' }
    });
    // Преобразуем directions в массив directions: Direction[]
    const result = projects.map(p => ({
      ...p,
      directions: p.directions.map((d: any) => d.direction)
    }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects', error });
  }
});

// GET project by id
router.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const project = await prisma.project.findUnique({
      where: { id: Number(id) },
      include: { directions: { include: { direction: true } } }
    });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({
      ...project,
      directions: project.directions.map((d: any) => d.direction)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching project', error });
  }
});

// POST a new project
router.post('/', async (req: Request, res: Response) => {
  const { title, description, image, client, industry, technologies, details, bgColor, textColor, directionIds } = req.body;
  if (!title || !description || !client || !industry || !technologies || !details) {
    return res.status(400).json({ message: 'Title, description, client, industry, technologies, and details are required' });
  }
  try {
    const newProject = await prisma.project.create({
      data: {
        title,
        description,
        image: image || null,
        client,
        industry,
        technologies,
        details,
        bgColor: bgColor || '#ffffff',
        textColor: textColor || '#222222',
        directions: directionIds && Array.isArray(directionIds)
          ? {
              create: directionIds.map((directionId: number) => ({ direction: { connect: { id: directionId } } }))
            }
          : undefined,
      },
      include: {
        directions: { include: { direction: true } }
      }
    });
    res.status(201).json({
      ...newProject,
      directions: newProject.directions.map((d: any) => d.direction)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating project', error });
  }
});

// PUT (update) a project
router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, image, client, industry, technologies, details, bgColor, textColor, directionIds } = req.body;
  try {
    // Обновляем основные поля
    const updatedProject = await prisma.project.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
        image: image || null,
        client,
        industry,
        technologies,
        details,
        bgColor,
        textColor,
      },
      include: { directions: { include: { direction: true } } }
    });
    // Если directionIds переданы — обновляем связи
    if (Array.isArray(directionIds)) {
      // Удаляем старые связи
      await prisma.projectDirection.deleteMany({ where: { projectId: updatedProject.id } });
      // Добавляем новые
      await prisma.project.update({
        where: { id: updatedProject.id },
        data: {
          directions: {
            create: directionIds.map((directionId: number) => ({ direction: { connect: { id: directionId } } }))
          }
        }
      });
    }
    // Получаем проект с directions
    const projectWithDirections = await prisma.project.findUnique({
      where: { id: Number(id) },
      include: { directions: { include: { direction: true } } }
    });
    res.json({
      ...projectWithDirections,
      directions: projectWithDirections?.directions.map((d: any) => d.direction)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating project', error });
  }
});

// DELETE a project
router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
  try {
    await prisma.project.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project', error });
  }
  });

export default router; 