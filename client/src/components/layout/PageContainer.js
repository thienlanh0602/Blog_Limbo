import { Box, Typography } from '@mui/material';

export default function PageContainer({ title, children, maxWidth = 1200 }) {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth,
        mx: 'auto',
        boxSizing: 'border-box',
      }}
    >
      {title && (
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
            fontWeight: 700,
            textAlign: 'center',
          }}
        >
          {title}
        </Typography>
      )}
      {children}
    </Box>
  );
}