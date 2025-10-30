import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const LoadingSpinner = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      width: '100%',
      padding: 4,
    }}
  >
    <CircularProgress />
  </Box>
);

export default LoadingSpinner;
