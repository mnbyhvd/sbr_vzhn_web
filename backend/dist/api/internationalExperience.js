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
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../generated/prisma");
const express_1 = require("express");
const prisma = new prisma_1.PrismaClient();
const router = (0, express_1.Router)();
// Получить все записи международного опыта
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const experiences = yield prisma.internationalExperience.findMany({
            orderBy: { order: 'asc' }
        });
        res.json(experiences);
    }
    catch (error) {
        console.error('Error fetching international experience:', error);
        res.status(500).json({ error: 'Failed to fetch international experience' });
    }
}));
// Создать новую запись
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, details, order } = req.body;
        const experience = yield prisma.internationalExperience.create({
            data: {
                title,
                details,
                order: order || 0
            }
        });
        res.json(experience);
    }
    catch (error) {
        console.error('Error creating international experience:', error);
        res.status(500).json({ error: 'Failed to create international experience' });
    }
}));
// Обновить запись
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { title, details, order } = req.body;
        const experience = yield prisma.internationalExperience.update({
            where: { id: parseInt(id) },
            data: {
                title,
                details,
                order
            }
        });
        res.json(experience);
    }
    catch (error) {
        console.error('Error updating international experience:', error);
        res.status(500).json({ error: 'Failed to update international experience' });
    }
}));
// Удалить запись
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma.internationalExperience.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'International experience deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting international experience:', error);
        res.status(500).json({ error: 'Failed to delete international experience' });
    }
}));
exports.default = router;
