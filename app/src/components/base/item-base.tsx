import { Box } from '@mui/material';
import { ReactNode } from 'react';

interface ItemBaseProp {
  children: ReactNode;
}

const ItemBase = ({ children }: ItemBaseProp) => {
  return (
    <Box overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis">
      {children}
    </Box>
  );
};

export default ItemBase;
