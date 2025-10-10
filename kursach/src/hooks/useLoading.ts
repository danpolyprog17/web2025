'use client';
import { useState, useEffect } from 'react';

export function useLoading() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Имитируем загрузку данных
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // 2.5 секунды загрузки

    return () => clearTimeout(timer);
  }, []);

  return isLoading;
}
