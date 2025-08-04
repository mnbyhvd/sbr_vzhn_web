// Утилита для безопасных API запросов
export const safeApiCall = async (url: string, options?: RequestInit) => {
  try {
    const response = await fetch(url, {
      ...options,
      credentials: 'include', // Включаем cookies для авторизации
    });

    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`);
      return null;
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('API returned non-JSON response');
      return null;
    }

    const data = await response.json();
    
    // Проверяем, что данные являются массивом или объектом
    if (Array.isArray(data)) {
      return data;
    } else if (typeof data === 'object' && data !== null) {
      return data;
    } else {
      console.error('API returned invalid data format');
      return null;
    }
  } catch (error) {
    console.error('API request failed:', error);
    return null;
  }
};

// Утилита для получения данных с fallback на пустой массив
export const getDataWithFallback = async (url: string): Promise<any[]> => {
  const data = await safeApiCall(url);
  return Array.isArray(data) ? data : [];
};

// Утилита для получения объекта с fallback на пустой объект
export const getObjectWithFallback = async (url: string): Promise<any> => {
  const data = await safeApiCall(url);
  return typeof data === 'object' && data !== null ? data : {};
}; 