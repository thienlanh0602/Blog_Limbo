// components/SectionHeader.jsx
import { Box } from '@mui/material';

export const SectionHeader = ({ title, action }) => {
    return (
        <Box sx={{ borderBottom: '2px solid black', mb: 3 }}>
            <Box display={'flex'}
                flexWrap={'wrap'}
                gap={2}
                my={6}
                mx={8}>
                {title}
                {action}
            </Box>
        </Box>
    );
};
