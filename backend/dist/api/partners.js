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
// GET all partners
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const partners = yield prisma.partner.findMany({
            orderBy: { order: 'asc' }
        });
        res.json(partners);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching partners', error });
    }
}));
// POST a new partner
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { name, logo, textColor, bgColor } = req.body;
    if (!name || !logo) {
        return res.status(400).json({ message: 'Name and logo are required' });
    }
    try {
        // Get the highest order number
        const lastPartner = yield prisma.partner.findFirst({
            orderBy: { order: 'desc' }
        });
        const nextOrder = ((_a = lastPartner === null || lastPartner === void 0 ? void 0 : lastPartner.order) !== null && _a !== void 0 ? _a : -1) + 1;
        const newPartner = yield prisma.partner.create({
            data: {
                name,
                logo,
                textColor: textColor || '#222222',
                bgColor: bgColor || '#ffffff',
                order: nextOrder,
            },
        });
        res.status(201).json(newPartner);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating partner', error });
    }
}));
// PUT (update) a partner
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, logo, textColor, bgColor } = req.body;
    try {
        const updatedPartner = yield prisma.partner.update({
            where: { id: Number(id) },
            data: {
                name,
                logo,
                textColor,
                bgColor,
            },
        });
        res.json(updatedPartner);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating partner', error });
    }
}));
// DELETE a partner
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.partner.delete({ where: { id: Number(id) } });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting partner', error });
    }
}));
// PATCH reorder partners
router.patch('/reorder', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { order } = req.body;
    if (!Array.isArray(order)) {
        return res.status(400).json({ message: 'Order array is required' });
    }
    try {
        yield Promise.all(order.map(({ id, order: orderNum }) => prisma.partner.update({
            where: { id: Number(id) },
            data: { order: orderNum },
        })));
        res.json({ message: 'Partners reordered successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error reordering partners', error });
    }
}));
exports.default = router;
