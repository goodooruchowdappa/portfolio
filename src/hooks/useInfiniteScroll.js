import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to manage infinite scrolling.
 * @param {{
 *   onLoadMore: (page: number) => void,
 *   hasMore: boolean,
 *   isLoading: boolean,
 * }} props - The hook props.
 * @returns {{
 *   page: number,
 *   resetPage: () => void,
 *   lastElementRef: (node: HTMLElement) => void,
 * }}
 */
export const useInfiniteScroll = ({ onLoadMore, hasMore, isLoading }) => {
  const [page, setPage] = useState(1);
  const [observer, setObserver] = useState(null);

  useEffect(() => {
    const intObserver = new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting && hasMore && !isLoading) {
        setPage((p) => p + 1);
      }
    });
    setObserver(intObserver);
    return () => {
      if (intObserver) {
        intObserver.disconnect();
      }
    };
  }, [hasMore, isLoading]);

  useEffect(() => {
    if (page > 1) {
      onLoadMore(page);
    }
  }, [page, onLoadMore]);

  const lastElementRef = useCallback(
    (node) => {
      if (observer) {
        observer.disconnect();
      }
      if (observer && node) {
        observer.observe(node);
      }
    },
    [observer]
  );

  const resetPage = useCallback(() => {
    setPage(1);
  }, []);

  return { page, resetPage, lastElementRef };
};
