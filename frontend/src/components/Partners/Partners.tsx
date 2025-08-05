import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Box, Typography, Paper } from '@mui/material';
import axios from 'axios';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// import required modules
import { Navigation, Pagination } from 'swiper/modules';

const API_URL = '/api/partners';

interface Partner {
    id: number;
    name: string;
    logo: string;
}

const Partners: React.FC = () => {
    const [partners, setPartners] = useState<Partner[]>([]);

    useEffect(() => {
        const fetchPartners = async () => {
            try {
                const response = await axios.get(API_URL);
                setPartners(response.data);
            } catch (error) {
                console.error('Failed to fetch partners:', error);
            }
        };

        fetchPartners();
    }, []);

    return (
        <Box sx={{ py: 6, backgroundColor: 'grey.100' }}>
            <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={50}
                slidesPerView={3}
                navigation
                pagination={{ clickable: true }}
                loop={true}
                style={{ padding: '20px 0' }}
            >
                {partners.map((partner, index) => (
                    <SwiperSlide key={index} style={{ textAlign: 'center' }}>
                        <Paper
                            elevation={2}
                            sx={{
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: 180,
                            }}
                        >
                            <img
                                src={partner.logo}
                                alt={partner.name}
                                style={{
                                    maxWidth: '100px',
                                    maxHeight: '100px',
                                    marginBottom: '10px',
                                }}
                            />
                            <Typography variant="subtitle1">{partner.name}</Typography>
                        </Paper>
                    </SwiperSlide>
                ))}
            </Swiper>
        </Box>
    );
};

export default Partners; 