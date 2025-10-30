import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  IconButton,
  Collapse,
  Button,
  Drawer,
  TextField,
  Paper,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import {
  loadCompanies,
  loadAllCompanies,
  resetCompanies,
  selectAllCompanies,
  selectCompanies,
  selectCompaniesStatus,
  selectCompaniesError,
  selectTotalCompanies,
  selectHasMoreCompanies,
  selectSelectedCompany,
  selectIsModalOpen,
  closeCompanyModal,
} from '../features/companies/companiesSlice';
import { useCompanyFilters } from '../hooks/useCompanyFilters';
import { useCompanySorter } from '../hooks/useCompanySorter';
import { useCompanyPaginator } from '../hooks/useCompanyPaginator';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { ROWS_PER_PAGE } from '../utils/constants';

import Filters from '../components/Filters';
import CompanyTable from '../components/CompanyTable';
import CompanyCard from '../components/CompanyCard';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import CompanyDetails from '../components/CompanyDetails';

const HomePage = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [showFilters, setShowFilters] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const companies = useSelector(selectCompanies);
  const allCompanies = useSelector(selectAllCompanies);
  const status = useSelector(selectCompaniesStatus);
  const error = useSelector(selectCompaniesError);
  const totalCount = useSelector(selectTotalCompanies);
  const hasMore = useSelector(selectHasMoreCompanies);
  const selectedCompany = useSelector(selectSelectedCompany);
  const isModalOpen = useSelector(selectIsModalOpen);

  const { filters, handleFilterChange } = useCompanyFilters();
  const { sortConfig, handleSort } = useCompanySorter({ key: 'name', direction: 'asc' });
  const { page, handlePageChange, resetPage: resetPaginationPage } = useCompanyPaginator();

  const areFiltersActive =
    filters.q ||
    filters.industry.length > 0 ||
    filters.location.length > 0 ||
    filters.foundedYear[0] !== 1980 ||
    filters.foundedYear[1] !== 2024;

  const {
    page: infiniteScrollPage,
    resetPage: resetInfiniteScrollPage,
    lastElementRef,
  } = useInfiniteScroll({
    onLoadMore: (newPage) => {
      if (!areFiltersActive) {
        dispatch(loadCompanies({ _page: newPage, _limit: ROWS_PER_PAGE }));
      }
    },
    hasMore,
    isLoading: status === 'loading',
  });

  useEffect(() => {
    dispatch(loadAllCompanies());
  }, [dispatch]);

  const loadFilteredCompanies = useCallback(() => {
    const currentPage = areFiltersActive ? page : infiniteScrollPage;
    const params = {
      _page: currentPage,
      _limit: ROWS_PER_PAGE,
      _sort: sortConfig.key,
      _order: sortConfig.direction,
      q: filters.q,
      foundedYear: filters.foundedYear,
    };
    if (filters.industry.length) {
      params.industry = filters.industry;
    }
    if (filters.location.length) {
      params.location = filters.location;
    }
    dispatch(loadCompanies(params));
  }, [dispatch, page, infiniteScrollPage, sortConfig, filters, areFiltersActive]);

  useEffect(() => {
    dispatch(resetCompanies());
    resetPaginationPage();
    resetInfiniteScrollPage();
  }, [filters, sortConfig, dispatch, resetPaginationPage, resetInfiniteScrollPage]);

  useEffect(() => {
    loadFilteredCompanies();
  }, [loadFilteredCompanies]);

  const onFilterChange = useCallback((newFilters) => {
    handleFilterChange(newFilters);
  }, [handleFilterChange]);

  const onSort = (key) => {
    handleSort(key);
  };

  const renderContent = () => {
    if (status === 'loading' && companies.length === 0) {
      return <LoadingSpinner />;
    }
    if (status === 'failed') {
      return <ErrorAlert message={error} onRetry={loadFilteredCompanies} />;
    }
    if (companies.length === 0) {
      return (
        <Card>
          <CardContent>
            <Typography>No results found.</Typography>
          </CardContent>
        </Card>
      );
    }
    return isDesktop ? (
      <CompanyTable companies={companies} onSort={onSort} sortConfig={sortConfig} />
    ) : (
      <>
        {companies.map((company, index) => (
          <div
            key={company.id}
            ref={index === companies.length - 1 ? lastElementRef : null}
          >
            <CompanyCard company={company} />
          </div>
        ))}
        {status === 'loading' && <LoadingSpinner />}
      </>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Companies Directory
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <TextField
          label="Search by company name"
          variant="outlined"
          size="small"
          value={filters.q}
          onChange={(e) => onFilterChange({ ...filters, q: e.target.value })}
          sx={{ flexGrow: 1, minWidth: '200px' }}
        />
        {isDesktop ? (
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={() => setShowFilters(!showFilters)}
            data-testid="desktop-filter-button"
          >
            {showFilters ? 'Hide' : 'Show'} Filters
          </Button>
        ) : (
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={() => setDrawerOpen(true)}
          >
            Filters
          </Button>
        )}
      </Box>

      {isDesktop ? (
        <Collapse in={showFilters}>
          <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
            <Filters
              onFilterChange={onFilterChange}
              companies={allCompanies}
              filters={filters}
              isSearchVisible={false}
            />
          </Paper>
        </Collapse>
      ) : (
        <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <Box sx={{ width: 250, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Advanced Filters
            </Typography>
            <Filters
              onFilterChange={onFilterChange}
              companies={allCompanies}
              filters={filters}
              isSearchVisible={false}
            />
          </Box>
        </Drawer>
      )}

      <Box sx={{ mt: 4 }}>{renderContent()}</Box>

      {totalCount > 0 && (isDesktop || areFiltersActive) && (
        <Pagination
          count={Math.ceil(totalCount / ROWS_PER_PAGE)}
          page={page}
          onChange={handlePageChange}
        />
      )}
      <CompanyDetails
        company={selectedCompany}
        open={isModalOpen}
        onClose={() => dispatch(closeCompanyModal())}
      />
    </Container>
  );
};

export default HomePage;
