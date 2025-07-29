import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';

interface SiteColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  footerBg: string;
  footerText: string;
}

interface ColorContextType {
  colors: SiteColors;
  loading: boolean;
  isHomePage: boolean;
  setIsHomePage: (isHome: boolean) => void;
}

const defaultColors: SiteColors = {
  primary: '#1A59DE',
  secondary: '#A4C2E8',
  background: '#fff',
  text: '#222222',
  footerBg: '#1A59DE',
  footerText: '#fff',
};

const ColorContext = createContext<ColorContextType>({
  colors: defaultColors,
  loading: false,
  isHomePage: false,
  setIsHomePage: () => {},
});

export const useColors = () => useContext(ColorContext);

interface ColorProviderProps {
  children: ReactNode;
}

export const ColorProvider: React.FC<ColorProviderProps> = ({ children }) => {
  const [colors, setColors] = useState<SiteColors>(defaultColors);
  const [loading, setLoading] = useState(true);
  const [isHomePage, setIsHomePage] = useState(false);

  useEffect(() => {
    const fetchColors = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/site-settings');
        if (response.data && response.data.colors) {
          const parsedColors = JSON.parse(response.data.colors);
          setColors(parsedColors);
        }
      } catch (error) {
        console.error('Ошибка загрузки цветов:', error);
        // Используем дефолтные цвета при ошибке
      } finally {
        setLoading(false);
      }
    };

    fetchColors();
  }, []);

  const value = {
    colors,
    loading,
    isHomePage,
    setIsHomePage,
  };

  return (
    <ColorContext.Provider value={value}>
      {children}
    </ColorContext.Provider>
  );
}; 