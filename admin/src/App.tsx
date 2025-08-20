import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/layout/AdminLayout';
import DashboardPage from './pages/dashboard/DashboardPage';
import ProjectsPage from './pages/projects/ProjectsPage';
import VacanciesPage from './pages/vacancies/VacanciesPage';
import PartnersPage from './pages/partners/PartnersPage';
import DirectionsPage from './pages/directions/DirectionsPage';
import TeamPage from './pages/team/TeamPage';
import FaqPage from './pages/faq/FaqPage';
import RequestsPage from './pages/requests/RequestsPage';
import SettingsPage from './pages/SettingsPage';
import InternationalExperiencePage from './pages/international-experience/InternationalExperiencePage';
import VacancyResponsesPage from './pages/vacancies/VacancyResponsesPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="vacancies" element={<VacanciesPage />} />
          <Route path="vacancies/responses" element={<VacancyResponsesPage />} />
          <Route path="team" element={<TeamPage />} />
          <Route path="partners" element={<PartnersPage />} />
          <Route path="directions" element={<DirectionsPage />} />
          <Route path="international-experience" element={<InternationalExperiencePage />} />
          <Route path="faq" element={<FaqPage />} />
          <Route path="requests" element={<RequestsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
