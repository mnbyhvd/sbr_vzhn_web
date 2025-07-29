import React, { useState, useEffect } from 'react';
import { Box, Typography, Divider, IconButton, Collapse } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/faq';

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

const FAQ: React.FC = () => {
  const [faqList, setFaqList] = useState<FaqItem[]>([]);
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  useEffect(() => {
    axios.get(API_URL).then(res => setFaqList(res.data));
  }, []);

  const handleToggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <Box
      sx={{
        width: '100%',
        background: 'rgba(164,194,232,0.85)',
        py: { xs: 4, md: 7 },
        boxSizing: 'border-box',
        borderRadius: 0,
        minHeight: 320,
      }}
    >
      <Box sx={{ maxWidth: 1440, mx: 'auto', px: { xs: 2, md: 6 } }}>
        <Typography
          sx={{
            fontWeight: 900,
            fontSize: { xs: 36, md: 64 },
            color: 'primary.main',
            mb: { xs: 3, md: 5 },
            textAlign: 'left',
            lineHeight: 1.1,
          }}
        >
          FAQ
        </Typography>
        {faqList.map((item, idx) => (
          <Box key={item.id}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                py: { xs: 2, md: 3 },
                cursor: 'pointer',
                userSelect: 'none',
              }}
              onClick={() => handleToggle(idx)}
            >
              <Typography
                sx={{
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: { xs: 20, md: 28 },
                  lineHeight: 1.2,
                  flex: 1,
                  pr: 2,
                  wordBreak: 'break-word',
                }}
              >
                {item.question}
              </Typography>
              <IconButton sx={{ color: 'primary.main', fontSize: { xs: 32, md: 40 }, transform: openIdx === idx ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>
                <ExpandMoreIcon sx={{ fontSize: { xs: 32, md: 40 } }} />
              </IconButton>
            </Box>
            <Collapse in={openIdx === idx} timeout="auto" unmountOnExit>
              <Box sx={{ pl: { xs: 0, md: 6 }, pr: { xs: 0, md: 6 }, pb: 2 }}>
                <Typography sx={{ color: '#fff', fontSize: { xs: 17, md: 20 }, opacity: 0.95 }}>{item.answer}</Typography>
              </Box>
            </Collapse>
            {idx < faqList.length - 1 && (
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.7)', my: 0 }} />
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default FAQ; 