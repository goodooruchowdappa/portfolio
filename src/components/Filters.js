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
  Slider,
  Typography,
  Grid,
  Paper,
} from '@mui/material';

/**
 * A component that provides filtering options for the company directory.
 * @param {{
 *   onFilterChange: (filters: { q: string, industry: string[], location: string[], foundedYear: number[] }) => void,
 *   companies: { industry: string, location: string }[]
 * }} props - The component props.
 * @returns {JSX.Element} The Filters component.
 */
const Filters = ({ onFilterChange, companies = [] }) => {
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [foundedYear, setFoundedYear] = useState([1980, 2024]);

  const industries = useMemo(() => [...new Set(companies.map((c) => c.industry))], [companies]);
  const locations = useMemo(() => [...new Set(companies.map((c) => c.location))], [companies]);

  useEffect(() => {
    onFilterChange({
      industry: selectedIndustries,
      location: selectedLocations,
      foundedYear,
    });
  }, [selectedIndustries, selectedLocations, foundedYear, onFilterChange]);

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

  const handleYearChange = (event, newValue) => {
    setFoundedYear(newValue);
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
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
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
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
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <Typography gutterBottom>Founded Year</Typography>
            <Slider
              value={foundedYear}
              onChange={handleYearChange}
              valueLabelDisplay="auto"
              min={1980}
              max={2024}
            />
          </FormControl>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Filters;
