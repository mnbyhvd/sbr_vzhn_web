export interface InternationalExperienceItem {
  id: number;
  title: string;
  details?: string;
}

export const internationalExperience: InternationalExperienceItem[] = [
  { id: 1, title: 'Целый ряд проектов в крупнейших американских банках', details: 'Выполняли интеграцию и разработку ПО для ведущих банков США, включая автоматизацию процессов и внедрение аналитических платформ.' },
  { id: 2, title: 'Платформа для покупки товаров в рассрочку (buy now, pay later)', details: 'Создание и запуск платформы BNPL для международного ритейлера. Включает интеграцию с платёжными системами и скорингом.' },
  { id: 3, title: 'TelcordiaTM Surveillance Manager' },
  { id: 4, title: 'Starpoint Analytics Engine (SAE) BIG Data Science' },
  { id: 5, title: 'Площадка Stock Market Game — обучение в сфере торговли на фондовых рынках' },
  { id: 6, title: 'Финтех по управлению благосостоянием Commonwealth Financial Network' },
]; 