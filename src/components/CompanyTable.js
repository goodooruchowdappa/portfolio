import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Link,
  TableSortLabel,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { openCompanyModal } from '../features/companies/companiesSlice';

/**
 * A table component for displaying a list of companies.
 * @param {{
 *   companies: { id: number, name: string, industry: string, location: string, employees: number, founded: number, website: string }[],
 *   onSort: (key: string) => void,
 *   sortConfig: { key: string, direction: 'asc' | 'desc' }
 * }} props - The component props.
 * @returns {JSX.Element} The CompanyTable component.
 */
const CompanyTable = ({ companies, onSort, sortConfig }) => {
  const dispatch = useDispatch();

  const handleRowClick = (company) => {
    dispatch(openCompanyModal(company));
  };

  const createSortHandler = (property) => (event) => {
    onSort(property);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={sortConfig.key === 'name'}
                direction={sortConfig.direction}
                onClick={createSortHandler('name')}
              >
                Company Name
              </TableSortLabel>
            </TableCell>
            <TableCell>Industry</TableCell>
            <TableCell>Location</TableCell>
            <TableCell align="right">Employees</TableCell>
            <TableCell align="right">
              <TableSortLabel
                active={sortConfig.key === 'founded'}
                direction={sortConfig.direction}
                onClick={createSortHandler('founded')}
              >
                Founded
              </TableSortLabel>
            </TableCell>
            <TableCell>Website</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {companies.map((company) => (
            <TableRow
              key={company.id}
              hover
              onClick={() => handleRowClick(company)}
              style={{ cursor: 'pointer' }}
            >
              <TableCell>{company.name}</TableCell>
              <TableCell>{company.industry}</TableCell>
              <TableCell>{company.location}</TableCell>
              <TableCell align="right">{company.employees.toLocaleString()}</TableCell>
              <TableCell align="right">{company.founded}</TableCell>
              <TableCell>
                <Link
                  href={company.website}
                  target="_blank"
                  rel="noopener"
                  onClick={(e) => e.stopPropagation()}
                >
                  {company.website}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CompanyTable;
