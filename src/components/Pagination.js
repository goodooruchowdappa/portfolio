import React from 'react';
import { Box, Pagination as MuiPagination } from '@mui/material';

const Pagination = ({ count, page, onChange }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', padding: 2 }}>
      <MuiPagination
        count={count}
        page={page}
        onChange={onChange}
        color="primary"
        showFirstButton
        showLastButton
      />
    </Box>
  );
};

export default Pagination;
