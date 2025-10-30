import { useState, useCallback } from 'react';

/**
 * Custom hook to manage pagination.
 * @param {number} initialPage - The initial page number.
 * @returns {{
 *   page: number,
 *   handlePageChange: (event: React.ChangeEvent<unknown>, value: number) => void,
 *   resetPage: () => void
 * }}
 */
export const useCompanyPaginator = (initialPage = 1) => {
  const [page, setPage] = useState(initialPage);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const resetPage = useCallback(() => {
    setPage(1);
  }, []);

  return { page, handlePageChange, resetPage };
};
