import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import ProjectsListPage from './pages/ProjectsListPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import VacanciesListPage from './pages/VacanciesListPage';
import VacancyDetailPage from './pages/VacancyDetailPage';
import PartnersListPage from './pages/PartnersListPage';
import DirectionsListPage from './pages/DirectionsListPage';
import { useColors } from './contexts/ColorContext';
import './App.css';

function AppRoutes() {
  const location = useLocation();
  const { setIsHomePage } = useColors();

  useEffect(() => {
    setIsHomePage(location.pathname === '/');
  }, [location.pathname, setIsHomePage]);

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="projects" element={<ProjectsListPage />} />
        <Route path="projects/:id" element={<ProjectDetailPage />} />
        <Route path="vacancies" element={<VacanciesListPage />} />
        <Route path="vacancies/:id" element={<VacancyDetailPage />} />
        <Route path="partners" element={<PartnersListPage />} />
        <Route path="directions" element={<DirectionsListPage />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
