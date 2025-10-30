import { useState, useCallback } from 'react';

/**
 * Custom hook to manage company filters.
 * @returns {{
 *   filters: { q: string, industry: string[], location: string[], foundedYear: number[] },
 *   handleFilterChange: (newFilters: { q: string, industry: string[], location: string[], foundedYear: number[] }) => void
 * }}
 */
export const useCompanyFilters = () => {
  const [filters, setFilters] = useState({
    q: '',
    industry: [],
    location: [],
    foundedYear: [1980, 2024],
  });

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  return { filters, handleFilterChange };
};
