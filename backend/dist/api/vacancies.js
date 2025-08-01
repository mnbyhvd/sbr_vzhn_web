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
// GET all vacancies
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { categoryId } = req.query;
        let where = {};
        if (categoryId) {
            where.categoryId = Number(categoryId);
        }
        const vacancies = yield prisma.vacancy.findMany({
            where,
            include: {
                category: true,
                responses: true,
            },
        });
        res.json(vacancies);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching vacancies', error });
    }
}));
// POST a new vacancy
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, requirements, textColor, bgColor, categoryId } = req.body;
    if (!title || !description || !requirements) {
        return res.status(400).json({ message: 'Title, description and requirements are required' });
    }
    try {
        const newVacancy = yield prisma.vacancy.create({
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
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating vacancy', error });
    }
}));
// PUT (update) a vacancy
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, description, requirements, textColor, bgColor, categoryId } = req.body;
    try {
        const updatedVacancy = yield prisma.vacancy.update({
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
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating vacancy', error });
    }
}));
// DELETE a vacancy
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.vacancy.delete({ where: { id: Number(id) } });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting vacancy', error });
    }
}));
// Получить все категории вакансий
router.get('/categories', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield prisma.vacancyCategory.findMany({
            orderBy: { name: 'asc' },
        });
        res.json(categories);
    }
    catch (error) {
        res.status(500).json({ message: 'Ошибка при получении категорий', error });
    }
}));
// Создать новую категорию вакансий
router.post('/categories', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'Название обязательно' });
    }
    try {
        const category = yield prisma.vacancyCategory.create({
            data: { name },
        });
        res.status(201).json(category);
    }
    catch (error) {
        if (error.code === 'P2002') {
            // Prisma: уникальное ограничение нарушено
            return res.status(409).json({ message: 'Категория с таким именем уже существует' });
        }
        res.status(500).json({ message: 'Ошибка при создании категории', error: error.message || error });
    }
}));
// Получить одну вакансию по id
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const vacancy = yield prisma.vacancy.findUnique({
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
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching vacancy', error });
    }
}));
// Получить все отклики на вакансию
router.get('/:id/responses', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const responses = yield prisma.vacancyResponse.findMany({
            where: { vacancyId: Number(id) },
            orderBy: { createdAt: 'desc' },
        });
        res.json(responses);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching responses', error });
    }
}));
// Отклик на вакансию
router.post('/:id/responses', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, email, phone, message } = req.body;
    if (!name || !email || !phone || !message) {
        return res.status(400).json({ message: 'Все поля обязательны' });
    }
    try {
        const response = yield prisma.vacancyResponse.create({
            data: {
                name,
                email,
                phone,
                message,
                vacancyId: Number(id),
            },
        });
        res.status(201).json(response);
    }
    catch (error) {
        res.status(500).json({ message: 'Ошибка при создании отклика', error });
    }
}));
exports.default = router;
