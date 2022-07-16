import { Box, Card, Divider, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface CardBaseProp {
  children: ReactNode;
  title?: string;
}

const CardBase = ({ children, title }: CardBaseProp) => {
  return (
    <Card sx={{ width: '100%', padding: '20px' }} elevation={3}>
      {title ? (
        <>
          <Box>
            <Typography variant="h5">{title}</Typography>
          </Box>
          <Box marginY="10px">
            <Divider />
          </Box>
        </>
      ) : null}
      {children}
    </Card>
  );
};

export default CardBase;
