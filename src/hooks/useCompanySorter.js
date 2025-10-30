import { useState, useCallback } from 'react';

/**
 * Custom hook to manage company sorting.
 * @param {{ key: string, direction: 'asc' | 'desc' }} initialConfig - The initial sorting configuration.
 * @returns {{
 *   sortConfig: { key: string, direction: 'asc' | 'desc' },
 *   handleSort: (key: string) => void
 * }}
 */
export const useCompanySorter = (initialConfig) => {
  const [sortConfig, setSortConfig] = useState(initialConfig);

  const handleSort = useCallback((key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  return { sortConfig, handleSort };
};
