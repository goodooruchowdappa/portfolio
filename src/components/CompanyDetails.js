import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
  Link,
  IconButton,
} from '@mui/material';
import {
  Business,
  LocationCity,
  Group,
  Event,
  Language,
  Close,
} from '@mui/icons-material';

const CompanyDetails = ({ company, open, onClose }) => {
  if (!company) {
    return null;
  }

  const {
    name,
    industry,
    location,
    employees,
    founded,
    website,
    about,
    logoUrl,
  } = company;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {name}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <img
            src={logoUrl}
            alt={`${name} logo`}
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              objectFit: 'cover',
              marginBottom: '16px',
            }}
          />
          <Chip icon={<Business />} label={industry} color="primary" sx={{ mb: 1 }} />
        </Box>

        <Typography variant="h6" gutterBottom>
          About
        </Typography>
        <Typography variant="body1" paragraph color="text.secondary">
          {about}
        </Typography>

        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
            <LocationCity sx={{ mr: 1.5, color: 'text.secondary' }} />
            <Typography variant="body2">{location}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
            <Group sx={{ mr: 1.5, color: 'text.secondary' }} />
            <Typography variant="body2">{employees.toLocaleString()} employees</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
            <Event sx={{ mr: 1.5, color: 'text.secondary' }} />
            <Typography variant="body2">Founded in {founded}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Language sx={{ mr: 1.5, color: 'text.secondary' }} />
            <Link href={website} target="_blank" rel="noopener noreferrer">
              {website}
            </Link>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CompanyDetails;
