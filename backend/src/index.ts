import express from 'express';
import cors from 'cors';
import path from 'path';
import 'dotenv/config';
import partnersRouter from './api/partners';
import directionsRouter from './api/directions';
import projectsRouter from './api/projects';
import vacanciesRouter from './api/vacancies';
import teamRouter from './api/team';
import faqRouter from './api/faq';
import requestsRouter from './api/requests';
import siteSettingsRouter from './api/siteSettings';
import uploadRouter from './api/upload';
import internationalExperienceRouter from './api/internationalExperience';
console.log('DATABASE_URL:', process.env.DATABASE_URL);
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Статические файлы для загрузок
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/', (req, res) => {
    res.send('Cybervision API is running!');
});

app.use('/api/partners', partnersRouter);
app.use('/api/directions', directionsRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/vacancies', vacanciesRouter);
app.use('/api/team', teamRouter);
app.use('/api/faq', faqRouter);
app.use('/api/requests', requestsRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/international-experience', internationalExperienceRouter);
app.use('/api/site-settings', siteSettingsRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
}); 