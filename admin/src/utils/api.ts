// Утилита для безопасных API запросов
export const safeApiCall = async (url: string, options?: RequestInit) => {
  console.log(`🔍 API Request: ${url}`, { options });
  
  try {
    const response = await fetch(url, {
      ...options,
      credentials: 'include', // Включаем cookies для авторизации
    });

    console.log(`📡 Response Status: ${response.status} ${response.statusText}`);
    console.log(`📋 Response Headers:`, Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      console.error(`❌ API Error: ${response.status} ${response.statusText}`);
      
      // Попробуем получить текст ответа для диагностики
      try {
        const errorText = await response.text();
        console.error(`📄 Error Response Body:`, errorText.substring(0, 500));
      } catch (e) {
        console.error(`📄 Could not read error response body:`, e);
      }
      
      return null;
    }

    const contentType = response.headers.get('content-type');
    console.log(`📄 Content-Type: ${contentType}`);
    
    if (!contentType || !contentType.includes('application/json')) {
      console.error('❌ API returned non-JSON response');
      
      // Попробуем получить текст ответа
      try {
        const textResponse = await response.text();
        console.error(`📄 Non-JSON Response Body:`, textResponse.substring(0, 500));
      } catch (e) {
        console.error(`📄 Could not read response body:`, e);
      }
      
      return null;
    }

    const data = await response.json();
    console.log(`✅ API Response Data:`, data);
    
    // Проверяем, что данные являются массивом или объектом
    if (Array.isArray(data)) {
      console.log(`📊 Response is Array with ${data.length} items`);
      return data;
    } else if (typeof data === 'object' && data !== null) {
      console.log(`📋 Response is Object:`, Object.keys(data));
      return data;
    } else {
      console.error('❌ API returned invalid data format:', typeof data, data);
      return null;
    }
  } catch (error) {
    console.error('❌ API request failed:', error);
    console.error('🔍 Error details:', {
      name: (error as any)?.name,
      message: (error as any)?.message,
      stack: (error as any)?.stack
    });
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