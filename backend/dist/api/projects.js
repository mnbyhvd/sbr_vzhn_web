"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = require("../generated/prisma");
const prisma = new prisma_1.PrismaClient();
const router = express_1.default.Router();
// GET all projects
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { directionId, client, search } = req.query;
        let where = {};
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
        const projects = yield prisma.project.findMany({
            where,
            include: {
                directions: {
                    include: { direction: true }
                }
            },
            orderBy: { id: 'asc' }
        });
        // Преобразуем directions в массив directions: Direction[]
        const result = projects.map(p => (Object.assign(Object.assign({}, p), { directions: p.directions.map((d) => d.direction) })));
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching projects', error });
    }
}));
// GET project by id
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const project = yield prisma.project.findUnique({
            where: { id: Number(id) },
            include: { directions: { include: { direction: true } } }
        });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.json(Object.assign(Object.assign({}, project), { directions: project.directions.map((d) => d.direction) }));
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching project', error });
    }
}));
// POST a new project
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, image, client, industry, technologies, details, bgColor, textColor, directionIds } = req.body;
    if (!title || !description || !client || !industry || !technologies || !details) {
        return res.status(400).json({ message: 'Title, description, client, industry, technologies, and details are required' });
    }
    try {
        const newProject = yield prisma.project.create({
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
                        create: directionIds.map((directionId) => ({ direction: { connect: { id: directionId } } }))
                    }
                    : undefined,
            },
            include: {
                directions: { include: { direction: true } }
            }
        });
        res.status(201).json(Object.assign(Object.assign({}, newProject), { directions: newProject.directions.map((d) => d.direction) }));
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating project', error });
    }
}));
// PUT (update) a project
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, description, image, client, industry, technologies, details, bgColor, textColor, directionIds } = req.body;
    try {
        // Обновляем основные поля
        const updatedProject = yield prisma.project.update({
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
            yield prisma.projectDirection.deleteMany({ where: { projectId: updatedProject.id } });
            // Добавляем новые
            yield prisma.project.update({
                where: { id: updatedProject.id },
                data: {
                    directions: {
                        create: directionIds.map((directionId) => ({ direction: { connect: { id: directionId } } }))
                    }
                }
            });
        }
        // Получаем проект с directions
        const projectWithDirections = yield prisma.project.findUnique({
            where: { id: Number(id) },
            include: { directions: { include: { direction: true } } }
        });
        res.json(Object.assign(Object.assign({}, projectWithDirections), { directions: projectWithDirections === null || projectWithDirections === void 0 ? void 0 : projectWithDirections.directions.map((d) => d.direction) }));
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating project', error });
    }
}));
// DELETE a project
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.project.delete({ where: { id: Number(id) } });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting project', error });
    }
}));
exports.default = router;
