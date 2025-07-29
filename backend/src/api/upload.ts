import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    // Создаем папку если её нет
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req: any, file: any, cb: any) => {
    // Генерируем уникальное имя файла
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Фильтр файлов - только изображения
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Неподдерживаемый тип файла. Разрешены только изображения (JPEG, PNG, GIF, WebP)'));
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB максимум
  }
});

// POST /api/upload - загрузка одного файла
router.post('/', upload.single('image'), (req: any, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Файл не был загружен' });
    }

    // Возвращаем информацию о загруженном файле
    const fileUrl = `/uploads/${req.file.filename}`;
    
    res.json({
      message: 'Файл успешно загружен',
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      url: fileUrl
    });
  } catch (error) {
    console.error('Ошибка загрузки файла:', error);
    res.status(500).json({ message: 'Ошибка загрузки файла' });
  }
});

// GET /api/upload/files - получение списка загруженных файлов
router.get('/files', (req: Request, res: Response) => {
  try {
    const uploadDir = path.join(__dirname, '../../uploads');
    
    if (!fs.existsSync(uploadDir)) {
      return res.json([]);
    }

    const files = fs.readdirSync(uploadDir)
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
      })
      .map(file => ({
        filename: file,
        url: `/uploads/${file}`,
        size: fs.statSync(path.join(uploadDir, file)).size
      }));

    res.json(files);
  } catch (error) {
    console.error('Ошибка получения списка файлов:', error);
    res.status(500).json({ message: 'Ошибка получения списка файлов' });
  }
});

// DELETE /api/upload/:filename - удаление файла
router.delete('/:filename', (req: Request, res: Response) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../../uploads', filename);
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ message: 'Файл успешно удален' });
    } else {
      res.status(404).json({ message: 'Файл не найден' });
    }
  } catch (error) {
    console.error('Ошибка удаления файла:', error);
    res.status(500).json({ message: 'Ошибка удаления файла' });
  }
});

export default router; 