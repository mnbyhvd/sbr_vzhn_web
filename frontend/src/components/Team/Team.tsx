import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Avatar } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import axios from 'axios';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const API_URL = '/api/team';

interface TeamMember {
    id: number;
    name: string;
    role: string;
    image: string;
}

const Team: React.FC = () => {
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

    useEffect(() => {
        const fetchTeamMembers = async () => {
            try {
                const response = await axios.get<TeamMember[]>(API_URL);
                setTeamMembers(response.data);
            } catch (error) {
                console.error("Failed to fetch team members", error);
            }
        };

        fetchTeamMembers();
    }, []);

  return (
    <Box sx={{ py: 8, px: { xs: 2, sm: 4, md: 8 }, backgroundColor: 'grey.100' }}>
      <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 6 }}>
        Наша команда
      </Typography>
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          600: { slidesPerView: 2 },
          900: { slidesPerView: 3 },
          1200: { slidesPerView: 4 },
        }}
      >
        {teamMembers.map((member) => (
          <SwiperSlide key={member.id}>
            <Card sx={{ textAlign: 'center', p: 2, height: '100%' }}>
              <Avatar
                src={member.image}
                alt={member.name}
                sx={{ width: 120, height: 120, margin: '0 auto 16px' }}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {member.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {member.role}
                </Typography>
              </CardContent>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default Team; 