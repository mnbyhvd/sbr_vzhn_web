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
    const record = await prisma.siteSettings.findFirst();
    if (!record) {
      // Возвращаем дефолтные значения, если в базе пусто (уже как объекты)
      return res.json({
        colors: JSON.parse(defaultSettings.colors),
        texts: JSON.parse(defaultSettings.texts || '{}'),
        contacts: JSON.parse(defaultSettings.contacts || '{}'),
        socials: JSON.parse(defaultSettings.socials || '{}'),
        qr: JSON.parse(defaultSettings.qr || '{}'),
        misc: JSON.parse(defaultSettings.misc || '{}'),
      });
    }

    // Преобразуем строки JSON из БД в объекты
    const response = {
      colors: safeJsonParse(record.colors, {}),
      texts: safeJsonParse(record.texts, {}),
      contacts: safeJsonParse(record.contacts, {}),
      socials: safeJsonParse(record.socials, {}),
      qr: safeJsonParse(record.qr, {}),
      misc: safeJsonParse(record.misc, {}),
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching site settings', error });
  }
});

// PUT site settings (update or create singleton)
router.put('/', async (req: Request, res: Response) => {
  const { colors, texts, contacts, socials, qr, misc } = req.body || {};
  try {
    const data = {
      colors: JSON.stringify(colors ?? {}),
      texts: JSON.stringify(texts ?? {}),
      contacts: JSON.stringify(contacts ?? {}),
      socials: JSON.stringify(socials ?? {}),
      qr: JSON.stringify(qr ?? {}),
      misc: JSON.stringify(misc ?? {}),
    };

    let settings = await prisma.siteSettings.findFirst();
    if (settings) {
      settings = await prisma.siteSettings.update({
        where: { id: settings.id },
        data,
      });
    } else {
      settings = await prisma.siteSettings.create({ data });
    }

    // Возвращаем нормализованный объект
    res.json({
      colors: safeJsonParse(data.colors, {}),
      texts: safeJsonParse(data.texts, {}),
      contacts: safeJsonParse(data.contacts, {}),
      socials: safeJsonParse(data.socials, {}),
      qr: safeJsonParse(data.qr, {}),
      misc: safeJsonParse(data.misc, {}),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating site settings', error });
  }
});

function safeJsonParse<T>(value: unknown, fallback: T): T {
  if (typeof value !== 'string') return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export default router; 