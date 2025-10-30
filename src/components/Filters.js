import React, { useState, useEffect, useMemo } from 'react';
import {
  TextField,
  Box,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Chip,
} from '@mui/material';

const Filters = ({ onFilterChange, companies }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);

  const industries = useMemo(() => [...new Set(companies.map((c) => c.industry))], [companies]);
  const locations = useMemo(() => [...new Set(companies.map((c) => c.location))], [companies]);

  useEffect(() => {
    const handler = setTimeout(() => {
      onFilterChange({
        q: searchTerm,
        industry: selectedIndustries,
        location: selectedLocations,
      });
    }, 500); // Debounce search term
    return () => clearTimeout(handler);
  }, [searchTerm, selectedIndustries, selectedLocations, onFilterChange]);

  const handleIndustryChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedIndustries(typeof value === 'string' ? value.split(',') : value);
  };

  const handleLocationChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedLocations(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        padding: 2,
        backgroundColor: 'background.paper',
        borderRadius: 1,
      }}
    >
      <TextField
        label="Search Companies"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ flexGrow: 1 }}
      />
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>Industry</InputLabel>
        <Select
          multiple
          value={selectedIndustries}
          onChange={handleIndustryChange}
          input={<OutlinedInput label="Industry" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
        >
          {industries.map((industry) => (
            <MenuItem key={industry} value={industry}>
              {industry}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>Location</InputLabel>
        <Select
          multiple
          value={selectedLocations}
          onChange={handleLocationChange}
          input={<OutlinedInput label="Location" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
        >
          {locations.map((location) => (
            <MenuItem key={location} value={location}>
              {location}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default Filters;
