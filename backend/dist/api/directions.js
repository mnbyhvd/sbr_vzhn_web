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
// GET all directions
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const directions = yield prisma.direction.findMany({
            orderBy: [
                { order: 'asc' },
                { id: 'asc' },
            ],
        });
        res.json(directions);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching directions', error });
    }
}));
// POST a new direction
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, gridSize, textColor, bgColor } = req.body;
    if (!title || !description || gridSize === undefined) {
        return res.status(400).json({ message: 'Title, description and gridSize are required' });
    }
    try {
        const newDirection = yield prisma.direction.create({
            data: {
                title,
                description,
                gridSize: Number(gridSize),
                textColor: textColor || '#222222',
                bgColor: bgColor || '#ffffff',
            },
        });
        res.status(201).json(newDirection);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating direction', error });
    }
}));
// PUT (update) a direction
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, description, gridSize, textColor, bgColor, order } = req.body;
    try {
        const updatedDirection = yield prisma.direction.update({
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
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating direction', error });
    }
}));
// DELETE a direction
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.direction.delete({ where: { id: Number(id) } });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting direction', error });
    }
}));
exports.default = router;
