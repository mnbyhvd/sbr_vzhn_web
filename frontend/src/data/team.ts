export interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
}

export const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: 'Иван Иванов',
    role: 'CEO',
    image: 'https://via.placeholder.com/300/0000FF/FFFFFF?text=II',
  },
  {
    id: 2,
    name: 'Мария Кузнецова',
    role: 'Ведущий архитектор',
    image: 'https://via.placeholder.com/300/FF0000/FFFFFF?text=MK',
  },
  {
    id: 3,
    name: 'Петр Сидоров',
    role: 'Руководитель отдела кибербезопасности',
    image: 'https://via.placeholder.com/300/00FF00/FFFFFF?text=PS',
  },
  // Добавьте ещё участников по необходимости
]; 