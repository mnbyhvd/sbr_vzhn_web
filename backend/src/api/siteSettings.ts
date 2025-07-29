import express, { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();
const router = express.Router();

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
router.get('/', async (req: Request, res: Response) => {
  try {
    let settings = await prisma.siteSettings.findFirst();
    if (!settings) {
      // Возвращаем дефолтные значения, если в базе пусто
      return res.json({ ...defaultSettings });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching site settings', error });
  }
});

// PUT site settings (update or create singleton)
router.put('/', async (req: Request, res: Response) => {
  const { colors, texts, contacts, socials, qr, misc } = req.body;
  try {
    let settings = await prisma.siteSettings.findFirst();
    if (settings) {
      settings = await prisma.siteSettings.update({
        where: { id: settings.id },
        data: { colors, texts, contacts, socials, qr, misc },
      });
    } else {
      settings = await prisma.siteSettings.create({
        data: { colors, texts, contacts, socials, qr, misc },
      });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Error updating site settings', error });
  }
});

export default router; 