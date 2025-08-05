import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const API_URL = '/api/vacancies';

interface Vacancy {
  id: number;
  title: string;
  description: string;
  requirements: string;
  createdAt?: string;
}

const Vacancies: React.FC = () => {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);

  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const response = await axios.get<Vacancy[]>(API_URL);
        setVacancies(response.data);
      } catch (error) {
        console.error('Failed to fetch vacancies', error);
      }
    };

    fetchVacancies();
  }, []);

  const sortedVacancies = [...vacancies].sort((a, b) => (b.createdAt && a.createdAt ? b.createdAt.localeCompare(a.createdAt) : 0));

  return (
    <Box sx={{ py: 8, px: { xs: 2, sm: 4, md: 8 } }}>
      <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 6 }}>
        Карьера у нас
      </Typography>
      <Paper elevation={2} sx={{ maxWidth: 900, mx: 'auto' }}>
        {sortedVacancies.length > 0 ? (
            sortedVacancies.map((vacancy) => (
                <Accordion key={vacancy.id}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel${vacancy.id}-content`}
                        id={`panel${vacancy.id}-header`}
                    >
                        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                            <Typography variant="h6">{vacancy.title}</Typography>
                            {vacancy.createdAt && (
                                <Typography variant="caption" sx={{ color: 'grey.600', fontStyle: 'italic' }}>
                                    {new Date(vacancy.createdAt).toLocaleDateString()}
                                </Typography>
                            )}
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography gutterBottom>
                            {vacancy.description}
                        </Typography>
                        <Typography variant="subtitle1" sx={{mt: 2, fontWeight: 'bold'}}>
                            Требования:
                        </Typography>
                        <Typography>
                            {vacancy.requirements}
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            ))
        ) : (
            <Typography align="center" sx={{p: 4}}>
                На данный момент открытых вакансий нет.
            </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default Vacancies; 