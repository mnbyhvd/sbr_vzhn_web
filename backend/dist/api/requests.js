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
// GET all requests
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requests = yield prisma.request.findMany();
        res.json(requests);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching requests', error });
    }
}));
// POST a new request
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ message: 'Name, email and message are required' });
    }
    try {
        const newRequest = yield prisma.request.create({
            data: {
                name,
                email,
                message,
            },
        });
        res.status(201).json(newRequest);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating request', error });
    }
}));
// DELETE a request
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.request.delete({ where: { id: Number(id) } });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting request', error });
    }
}));
exports.default = router;
