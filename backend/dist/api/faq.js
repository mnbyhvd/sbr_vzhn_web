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
// GET all faqs
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const faqs = yield prisma.faq.findMany();
        res.json(faqs);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching faqs', error });
    }
}));
// POST a new faq
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { question, answer } = req.body;
    if (!question || !answer) {
        return res.status(400).json({ message: 'Question and answer are required' });
    }
    try {
        const newFaq = yield prisma.faq.create({
            data: {
                question,
                answer,
            },
        });
        res.status(201).json(newFaq);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating faq', error });
    }
}));
// PUT (update) a faq
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { question, answer } = req.body;
    try {
        const updatedFaq = yield prisma.faq.update({
            where: { id: Number(id) },
            data: {
                question,
                answer,
            },
        });
        res.json(updatedFaq);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating faq', error });
    }
}));
// DELETE a faq
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.faq.delete({ where: { id: Number(id) } });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting faq', error });
    }
}));
exports.default = router;
