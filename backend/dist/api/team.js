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
// GET all team members
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const teamMembers = yield prisma.teamMember.findMany({
            orderBy: { order: 'asc' }
        });
        res.json(teamMembers);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching team members', error });
    }
}));
// POST a new team member
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { name, role, image, textColor, bgColor } = req.body;
    if (!name || !role || !image) {
        return res.status(400).json({ message: 'Name, role and image are required' });
    }
    try {
        // Get the highest order number
        const lastMember = yield prisma.teamMember.findFirst({
            orderBy: { order: 'desc' }
        });
        const nextOrder = ((_a = lastMember === null || lastMember === void 0 ? void 0 : lastMember.order) !== null && _a !== void 0 ? _a : -1) + 1;
        const newMember = yield prisma.teamMember.create({
            data: {
                name,
                role,
                image,
                textColor: textColor || '#222222',
                bgColor: bgColor || '#ffffff',
                order: nextOrder,
            },
        });
        res.status(201).json(newMember);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating team member', error });
    }
}));
// PUT (update) a team member
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, role, image, textColor, bgColor } = req.body;
    try {
        const updatedMember = yield prisma.teamMember.update({
            where: { id: Number(id) },
            data: {
                name,
                role,
                image,
                textColor,
                bgColor,
            },
        });
        res.json(updatedMember);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating team member', error });
    }
}));
// DELETE a team member
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma.teamMember.delete({ where: { id: Number(id) } });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting team member', error });
    }
}));
// PATCH reorder team members
router.patch('/reorder', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { order } = req.body;
    if (!Array.isArray(order)) {
        return res.status(400).json({ message: 'Order array is required' });
    }
    try {
        yield Promise.all(order.map(({ id, order: orderNum }) => prisma.teamMember.update({
            where: { id: Number(id) },
            data: { order: orderNum },
        })));
        res.json({ message: 'Team members reordered successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error reordering team members', error });
    }
}));
exports.default = router;
