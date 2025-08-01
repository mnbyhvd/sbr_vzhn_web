"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const router = express_1.default.Router();
// Настройка multer для загрузки файлов
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path_1.default.join(__dirname, '../../uploads');
        // Создаем папку если её нет
        if (!fs_1.default.existsSync(uploadDir)) {
            fs_1.default.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Генерируем уникальное имя файла
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path_1.default.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});
// Фильтр файлов - только изображения
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('Неподдерживаемый тип файла. Разрешены только изображения (JPEG, PNG, GIF, WebP)'));
    }
};
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB максимум
    }
});
// POST /api/upload - загрузка одного файла
router.post('/', upload.single('image'), (req, res) => {
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
    }
    catch (error) {
        console.error('Ошибка загрузки файла:', error);
        res.status(500).json({ message: 'Ошибка загрузки файла' });
    }
});
// GET /api/upload/files - получение списка загруженных файлов
router.get('/files', (req, res) => {
    try {
        const uploadDir = path_1.default.join(__dirname, '../../uploads');
        if (!fs_1.default.existsSync(uploadDir)) {
            return res.json([]);
        }
        const files = fs_1.default.readdirSync(uploadDir)
            .filter(file => {
            const ext = path_1.default.extname(file).toLowerCase();
            return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
        })
            .map(file => ({
            filename: file,
            url: `/uploads/${file}`,
            size: fs_1.default.statSync(path_1.default.join(uploadDir, file)).size
        }));
        res.json(files);
    }
    catch (error) {
        console.error('Ошибка получения списка файлов:', error);
        res.status(500).json({ message: 'Ошибка получения списка файлов' });
    }
});
// DELETE /api/upload/:filename - удаление файла
router.delete('/:filename', (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path_1.default.join(__dirname, '../../uploads', filename);
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlinkSync(filePath);
            res.json({ message: 'Файл успешно удален' });
        }
        else {
            res.status(404).json({ message: 'Файл не найден' });
        }
    }
    catch (error) {
        console.error('Ошибка удаления файла:', error);
        res.status(500).json({ message: 'Ошибка удаления файла' });
    }
});
exports.default = router;
