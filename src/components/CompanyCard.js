import React from 'react';
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
  Link,
  Chip,
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import GroupIcon from '@mui/icons-material/Group';
import EventIcon from '@mui/icons-material/Event';
import { useDispatch } from 'react-redux';
import { openCompanyModal } from '../features/companies/companiesSlice';

/**
 * A card component for displaying company information.
 * @param {{
 *   company: { name: string, industry: string, location: string, employees: number, founded: number, website: string }
 * }} props - The component props.
 * @returns {JSX.Element} The CompanyCard component.
 */
const CompanyCard = ({ company }) => {
  const dispatch = useDispatch();

  const handleCardClick = () => {
    dispatch(openCompanyModal(company));
  };

  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardActionArea onClick={handleCardClick}>
        <CardContent>
          <Typography variant="h6" component="div" gutterBottom>
            {company.name}
          </Typography>
          <Chip label={company.industry} color="primary" sx={{ mb: 1 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <LocationOnIcon sx={{ mr: 1 }} color="action" />
            <Typography variant="body2">{company.location}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <GroupIcon sx={{ mr: 1 }} color="action" />
            <Typography variant="body2">{company.employees.toLocaleString()} Employees</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <EventIcon sx={{ mr: 1 }} color="action" />
            <Typography variant="body2">Founded in {company.founded}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <BusinessIcon sx={{ mr: 1 }} color="action" />
            <Link
              href={company.website}
              target="_blank"
              rel="noopener"
              onClick={(e) => e.stopPropagation()}
            >
              Visit Website
            </Link>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default CompanyCard;
