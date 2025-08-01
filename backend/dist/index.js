"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
require("dotenv/config");
const partners_1 = __importDefault(require("./api/partners"));
const directions_1 = __importDefault(require("./api/directions"));
const projects_1 = __importDefault(require("./api/projects"));
const vacancies_1 = __importDefault(require("./api/vacancies"));
const team_1 = __importDefault(require("./api/team"));
const faq_1 = __importDefault(require("./api/faq"));
const requests_1 = __importDefault(require("./api/requests"));
const siteSettings_1 = __importDefault(require("./api/siteSettings"));
const upload_1 = __importDefault(require("./api/upload"));
const internationalExperience_1 = __importDefault(require("./api/internationalExperience"));
console.log('DATABASE_URL:', process.env.DATABASE_URL);
const app = (0, express_1.default)();
const port = process.env.PORT || 3001;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Статические файлы для загрузок
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
app.get('/', (req, res) => {
    res.send('Cybervision API is running!');
});
app.use('/api/partners', partners_1.default);
app.use('/api/directions', directions_1.default);
app.use('/api/projects', projects_1.default);
app.use('/api/vacancies', vacancies_1.default);
app.use('/api/team', team_1.default);
app.use('/api/faq', faq_1.default);
app.use('/api/requests', requests_1.default);
app.use('/api/upload', upload_1.default);
app.use('/api/international-experience', internationalExperience_1.default);
app.use('/api/site-settings', siteSettings_1.default);
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
