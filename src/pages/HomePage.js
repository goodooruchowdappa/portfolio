import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
} from '@mui/material';
import {
  loadCompanies,
  loadAllCompanies,
  selectAllCompanies,
  selectCompanies,
  selectCompaniesStatus,
  selectCompaniesError,
  selectTotalCompanies,
} from '../features/companies/companiesSlice';

import Filters from '../components/Filters';
import CompanyTable from '../components/CompanyTable';
import CompanyCard from '../components/CompanyCard';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

const HomePage = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const companies = useSelector(selectCompanies);
  const allCompanies = useSelector(selectAllCompanies);
  const status = useSelector(selectCompaniesStatus);
  const error = useSelector(selectCompaniesError);
  const totalCount = useSelector(selectTotalCompanies);

  const [filters, setFilters] = useState({ q: '', industry: [], location: [] });
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    dispatch(loadAllCompanies());
  }, [dispatch]);

  const loadFilteredCompanies = useCallback(() => {
    const params = {
      _page: page,
      _limit: rowsPerPage,
      _sort: sortConfig.key,
      _order: sortConfig.direction,
      q: filters.q,
    };
    if (filters.industry.length) {
      params.industry = filters.industry;
    }
    if (filters.location.length) {
      params.location = filters.location;
    }
    dispatch(loadCompanies(params));
  }, [dispatch, page, sortConfig, filters]);

  useEffect(() => {
    loadFilteredCompanies();
  }, [loadFilteredCompanies]);

  const handleFilterChange = useCallback((newFilters) => {
    setPage(1);
    setFilters(newFilters);
  }, []);

  const handleSort = (key) => {
    setPage(1);
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const renderContent = () => {
    if (status === 'loading') {
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
      <CompanyTable companies={companies} onSort={handleSort} sortConfig={sortConfig} />
    ) : (
      companies.map((company) => <CompanyCard key={company.id} company={company} />)
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Companies Directory
      </Typography>
      <Filters onFilterChange={handleFilterChange} companies={allCompanies} />
      <Box sx={{ mt: 4 }}>{renderContent()}</Box>
      {totalCount > 0 && (
        <Pagination
          count={Math.ceil(totalCount / rowsPerPage)}
          page={page}
          onChange={handlePageChange}
        />
      )}
    </Container>
  );
};

export default HomePage;
