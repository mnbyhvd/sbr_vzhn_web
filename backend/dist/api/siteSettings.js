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
// Дефолтные значения (как на фронте)
const defaultSettings = {
    colors: JSON.stringify({
        direction: { bg: '#fff', text: '#1A59DE' },
        project: { bg: '#fff', text: '#222222' },
        partner: { bg: '#fff', text: '#222222' },
        vacancy: { bg: '#fff', text: '#1A59DE' },
        team: { bg: '#fff', text: '#222222' },
        primary: '#1A59DE',
        secondary: '#A4C2E8',
        textDark: '#0D2C75',
        background: '#fff',
    }),
    texts: JSON.stringify({}),
    contacts: JSON.stringify({}),
    socials: JSON.stringify({}),
    qr: JSON.stringify({}),
    misc: JSON.stringify({}),
};
// GET site settings (singleton)
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let settings = yield prisma.siteSettings.findFirst();
        if (!settings) {
            // Возвращаем дефолтные значения, если в базе пусто
            return res.json(Object.assign({}, defaultSettings));
        }
        res.json(settings);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching site settings', error });
    }
}));
// PUT site settings (update or create singleton)
router.put('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { colors, texts, contacts, socials, qr, misc } = req.body;
    try {
        let settings = yield prisma.siteSettings.findFirst();
        if (settings) {
            settings = yield prisma.siteSettings.update({
                where: { id: settings.id },
                data: { colors, texts, contacts, socials, qr, misc },
            });
        }
        else {
            settings = yield prisma.siteSettings.create({
                data: { colors, texts, contacts, socials, qr, misc },
            });
        }
        res.json(settings);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating site settings', error });
    }
}));
exports.default = router;
