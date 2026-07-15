import { Box } from '@mui/material';

export const SectionHeader = ({ title, action }) => {
    return (
        <Box sx={{ borderBottom: '2px solid black', mb: { xs: 2, md: 3 } }}>
            <Box
                display={'flex'}
                flexWrap={'wrap'}
                gap={2}
                my={{ xs: 3, md: 6 }}
                mx={{ xs: 0, sm: 2, md: 8 }}
                alignItems="center"
                justifyContent="space-between"
            >
                {title}
                {action}
            </Box>
        </Box>
    );
};
