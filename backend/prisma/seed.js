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
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../src/generated/prisma");
const prisma = new prisma_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // Удаляем все старые данные (очистка таблиц)
        yield prisma.vacancyResponse.deleteMany({});
        yield prisma.projectDirection.deleteMany({});
        yield prisma.project.deleteMany({});
        yield prisma.partner.deleteMany({});
        yield prisma.teamMember.deleteMany({});
        yield prisma.vacancy.deleteMany({});
        yield prisma.vacancyCategory.deleteMany({});
        yield prisma.direction.deleteMany({});
        yield prisma.faq.deleteMany({});
        yield prisma.siteSettings.deleteMany({});
        yield prisma.internationalExperience.deleteMany({});
        // Partners
        yield prisma.partner.createMany({ data: [
                { name: 'Газпром нефть', logo: 'https://via.placeholder.com/150/0000FF/808080?Text=Partner1', textColor: '#222222', bgColor: '#ffffff' },
                { name: 'Росатом', logo: 'https://via.placeholder.com/150/FF0000/FFFFFF?Text=Partner2', textColor: '#222222', bgColor: '#ffffff' },
                { name: 'Сбер', logo: 'https://via.placeholder.com/150/00FF00/000000?Text=Partner3', textColor: '#222222', bgColor: '#ffffff' },
            ] });
        // Projects с новыми опциональными полями
        yield prisma.project.createMany({ data: [
                {
                    title: 'Разработка CRM для финтех-стартапа',
                    description: 'Создали кастомную CRM-систему с нуля, что позволило автоматизировать продажи и маркетинг.',
                    image: 'https://via.placeholder.com/400x300/1A59DE/FFFFFF?text=CRM+Project',
                    client: 'Финтех-стартап',
                    industry: 'Финансы',
                    technologies: 'React, Node.js, MySQL, Docker',
                    details: 'Полный цикл разработки CRM-системы включал анализ требований, проектирование архитектуры, разработку frontend и backend, тестирование и внедрение. Система интегрирована с платежными шлюзами и аналитическими инструментами.',
                    bgColor: '#ffffff',
                    textColor: '#222222',
                    startDate: new Date('2023-01-01'),
                    endDate: new Date('2023-06-01'),
                    team: '["Иван Иванов", "Мария Кузнецова"]',
                    links: '["https://crm.example.com"]',
                    status: 'Выполнен',
                    curator: 'Петр Сидоров',
                    budget: '2 000 000 ₽',
                    tools: 'React, Node.js, Docker',
                    feedback: 'Клиент остался доволен',
                    presentation: 'https://example.com/presentation.pdf'
                },
                {
                    title: 'Миграция в облако для ритейл-сети',
                    description: 'Перенесли всю инфраструктуру крупной торговой сети в Yandex.Cloud, снизив затраты на 30%.',
                    image: 'https://via.placeholder.com/400x300/A4C2E8/FFFFFF?text=Cloud+Migration',
                    client: 'Ритейл-сеть',
                    industry: 'Розничная торговля',
                    technologies: 'AWS, Kubernetes, Terraform, Ansible',
                    details: 'Проект включал аудит существующей инфраструктуры, планирование миграции, настройку облачной инфраструктуры, перенос данных и приложений, а также обучение персонала. Результат - повышение производительности на 40% и снижение затрат на 30%.',
                    bgColor: '#ffffff',
                    textColor: '#222222',
                    startDate: new Date('2022-03-01'),
                    endDate: new Date('2022-09-01'),
                    team: '["Мария Кузнецова", "Петр Сидоров"]',
                    links: '["https://cloud.example.com"]',
                    status: 'Выполнен',
                    curator: 'Мария Кузнецова',
                    budget: '3 500 000 ₽',
                    tools: 'AWS, Kubernetes, Terraform',
                    feedback: 'Производительность выросла на 40%',
                    presentation: 'https://example.com/cloud-presentation.pdf'
                },
            ] });
        // Vacancy Categories
        const categories = yield prisma.vacancyCategory.createMany({
            data: [
                { name: 'Frontend' },
                { name: 'Backend' },
                { name: 'DevOps' },
                { name: 'Дизайн' },
                { name: 'Менеджмент' },
            ],
            skipDuplicates: true,
        });
        // Получаем id категорий
        const frontendCategory = yield prisma.vacancyCategory.findUnique({ where: { name: 'Frontend' } });
        const backendCategory = yield prisma.vacancyCategory.findUnique({ where: { name: 'Backend' } });
        // Vacancies с новыми опциональными полями
        yield prisma.vacancy.createMany({
            data: [
                {
                    title: 'Frontend-разработчик (React)',
                    description: 'Ищем талантливого frontend-разработчика для работы над интересными проектами.',
                    requirements: 'React, TypeScript, Redux, Material-UI',
                    textColor: '#222222',
                    bgColor: '#ffffff',
                    categoryId: frontendCategory === null || frontendCategory === void 0 ? void 0 : frontendCategory.id,
                    salary: 'от 150 000 ₽',
                    location: 'Москва, удалённо',
                    workFormat: 'Гибрид',
                    schedule: 'Полная занятость',
                    publishedAt: new Date('2024-07-01'),
                    hrContact: 'hr@company.ru',
                    bonuses: 'ДМС, спортзал',
                    selectionStages: 'HR-интервью, тестовое, тех. интервью',
                    stack: 'React, TypeScript, Redux',
                    experience: 'от 2 лет',
                    education: 'Высшее',
                    links: '["https://company.ru/vacancy"]',
                    pdf: 'https://company.ru/vacancy.pdf'
                },
                {
                    title: 'Backend-разработчик (Node.js)',
                    description: 'Нужен опытный backend-разработчик для создания и поддержки серверной части наших продуктов.',
                    requirements: 'Node.js, Express, MySQL, Docker',
                    textColor: '#222222',
                    bgColor: '#ffffff',
                    categoryId: backendCategory === null || backendCategory === void 0 ? void 0 : backendCategory.id,
                    salary: 'от 180 000 ₽',
                    location: 'Санкт-Петербург, удалённо',
                    workFormat: 'Удалёнка',
                    schedule: 'Гибкий график',
                    publishedAt: new Date('2024-07-02'),
                    hrContact: 'hr2@company.ru',
                    bonuses: 'Оплата обучения, премии',
                    selectionStages: 'HR-интервью, тех. интервью',
                    stack: 'Node.js, MySQL, Docker',
                    experience: 'от 3 лет',
                    education: 'Высшее',
                    links: '["https://company.ru/vacancy-backend"]',
                    pdf: 'https://company.ru/vacancy-backend.pdf'
                },
            ],
            skipDuplicates: true,
        });
        // Получаем id вакансий
        const frontendVacancy = yield prisma.vacancy.findFirst({ where: { title: { contains: 'Frontend' } } });
        const backendVacancy = yield prisma.vacancy.findFirst({ where: { title: { contains: 'Backend' } } });
        // Vacancy Responses (отклики)
        if (frontendVacancy && backendVacancy) {
            yield prisma.vacancyResponse.createMany({
                data: [
                    {
                        name: 'Иван Кандидатов',
                        email: 'ivan@example.com',
                        phone: '+7 900 111-22-33',
                        message: 'Хочу работать у вас frontend-разработчиком!',
                        vacancyId: frontendVacancy.id,
                    },
                    {
                        name: 'Мария Backendова',
                        email: 'maria@example.com',
                        phone: '+7 900 222-33-44',
                        message: 'Backend — моя страсть, рассмотрите мою кандидатуру.',
                        vacancyId: backendVacancy.id,
                    },
                ],
                skipDuplicates: true,
            });
        }
        // Team
        yield prisma.teamMember.createMany({ data: [
                {
                    name: 'Иван Иванов',
                    role: 'CEO',
                    image: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=II',
                    textColor: '#222222',
                    bgColor: '#ffffff',
                },
                {
                    name: 'Мария Кузнецова',
                    role: 'Ведущий архитектор',
                    image: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=MK',
                    textColor: '#222222',
                    bgColor: '#ffffff',
                },
                {
                    name: 'Петр Сидоров',
                    role: 'Руководитель отдела кибербезопасности',
                    image: 'https://via.placeholder.com/150/00FF00/FFFFFF?text=PS',
                    textColor: '#222222',
                    bgColor: '#ffffff',
                },
            ] });
        // FAQ
        yield prisma.faq.createMany({ data: [
                {
                    question: 'Какие услуги вы предоставляете?',
                    answer: 'Мы предлагаем широкий спектр IT-услуг, включая стратегический консалтинг, разработку ПО, системную интеграцию, кибербезопасность и облачные решения.'
                },
                {
                    question: 'Как начать с вами работать?',
                    answer: 'Самый простой способ — оставить заявку через форму на нашем сайте. Наш менеджер свяжется с вами для обсуждения деталей вашего проекта.'
                },
                {
                    question: 'Предоставляете ли вы техническую поддержку?',
                    answer: 'Да, мы предоставляем полную техническую поддержку и сопровождение для всех реализованных нами проектов и внедренных решений.'
                },
            ] });
        // SiteSettings
        yield prisma.siteSettings.create({
            data: {
                colors: JSON.stringify({
                    primary: '#1A59DE',
                    secondary: '#A4C2E8',
                    background: '#fff',
                    text: '#222222',
                    footerBg: '#1A59DE',
                    footerText: '#fff',
                }),
                texts: JSON.stringify({
                    siteName: 'CyberVision',
                    slogan: 'Цифровые решения для бизнеса',
                    footer: '© 2024 CyberVision. Все права защищены.'
                }),
                contacts: JSON.stringify({
                    email: 'info@cybervision.ru',
                    phone: '+7 (495) 123-45-67',
                    address: '123456, г. Москва, ул. Центральная, д. 1'
                }),
                socials: JSON.stringify({
                    vk: 'https://vk.com/cybervision',
                    telegram: 'https://t.me/cybervision',
                    whatsapp: 'https://wa.me/79991234567',
                    youtube: 'https://youtube.com/@cybervision',
                    facebook: '',
                    instagram: ''
                }),
                qr: JSON.stringify({
                    image: '',
                    link: ''
                }),
                misc: JSON.stringify({
                    presentation: '',
                    banner: ''
                })
            }
        });
        // Directions
        yield prisma.direction.createMany({
            data: [
                {
                    title: 'Финтех',
                    description: 'Ведение портфолио, учет операций, контроль рисков, валидация и отчетность для классических инвесторов и криптовалют',
                    gridSize: 1,
                    textColor: '#1A59DE',
                    bgColor: '#fff',
                },
                {
                    title: 'Развитие платежной системы',
                    description: 'Разработка дополнительных сервисов, интеграции и клиентских приложений',
                    gridSize: 1,
                    textColor: '#fff',
                    bgColor: '#1A59DE',
                },
                {
                    title: 'Автоматизация банковских процессов',
                    description: 'Автоматизация и контроль внутренних банковских процессов для повышения эффективности',
                    gridSize: 1,
                    textColor: '#fff',
                    bgColor: '#A4C2E8',
                },
                {
                    title: 'Системы безопасности',
                    description: 'Разработка ПО для считывания радужной оболочки глаза в части интеграции с системами доступа к программам, компьютерам, дверям в здания внутри зданий',
                    gridSize: 2,
                    textColor: '#fff',
                    bgColor: '#1A59DE',
                },
                {
                    title: 'Поддержка здорового образа жизни',
                    description: 'Разработка программного комплекса индивидуального мониторинга функциональных резервов сердечно-сосудистой системы организма на основе использования миниатюрных датчиков, облачных вычислений и искусственного интеллекта',
                    gridSize: 1,
                    textColor: '#1A59DE',
                    bgColor: '#fff',
                },
            ]
        });
        // --- Связываем проекты с направлениями (many-to-many) ---
        const allProjects = yield prisma.project.findMany();
        const allDirections = yield prisma.direction.findMany();
        if (allProjects.length >= 2 && allDirections.length >= 4) {
            // Первый проект — первые два направления
            yield prisma.projectDirection.createMany({
                data: [
                    { projectId: allProjects[0].id, directionId: allDirections[0].id },
                    { projectId: allProjects[0].id, directionId: allDirections[1].id },
                ]
            });
            // Второй проект — третье и четвёртое направления
            yield prisma.projectDirection.createMany({
                data: [
                    { projectId: allProjects[1].id, directionId: allDirections[2].id },
                    { projectId: allProjects[1].id, directionId: allDirections[3].id },
                ]
            });
        }
        // International Experience
        yield prisma.internationalExperience.createMany({
            data: [
                {
                    title: 'Целый ряд проектов в крупнейших американских банках',
                    details: 'Выполняли интеграцию и разработку ПО для ведущих банков США, включая автоматизацию процессов и внедрение аналитических платформ.',
                    order: 1
                },
                {
                    title: 'Платформа для покупки товаров в рассрочку (buy now, pay later)',
                    details: 'Создание и запуск платформы BNPL для международного ритейлера. Включает интеграцию с платёжными системами и скорингом.',
                    order: 2
                },
                {
                    title: 'TelcordiaTM Surveillance Manager',
                    details: null,
                    order: 3
                },
                {
                    title: 'Starpoint Analytics Engine (SAE) BIG Data Science',
                    details: null,
                    order: 4
                },
                {
                    title: 'Площадка Stock Market Game — обучение в сфере торговли на фондовых рынках',
                    details: null,
                    order: 5
                },
                {
                    title: 'Финтех по управлению благосостоянием Commonwealth Financial Network',
                    details: null,
                    order: 6
                },
            ]
        });
    });
}
main().catch(e => {
    console.error(e);
    process.exit(1);
}).finally(() => prisma.$disconnect());
