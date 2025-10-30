import React from 'react';
import { Alert, AlertTitle, Button } from '@mui/material';

const ErrorAlert = ({ message, onRetry }) => (
  <Alert
    severity="error"
    action={
      <Button color="inherit" size="small" onClick={onRetry}>
        Retry
      </Button>
    }
    sx={{ margin: 2 }}
  >
    <AlertTitle>Error</AlertTitle>
    {message || 'An unexpected error occurred.'}
  </Alert>
);

export default ErrorAlert;
