import { useTheme, useMediaQuery } from '@mui/material';

export default function useResponsive(query, start, end) {
    const theme = useTheme();

    const up = useMediaQuery(theme.breakpoints.up(start));
    const down = useMediaQuery(theme.breakpoints.down(start));
    const between = useMediaQuery(theme.breakpoints.between(start, end));
    const only = useMediaQuery(theme.breakpoints.only(start));

    if (query === 'up') return up;
    if (query === 'down') return down;
    if (query === 'between') return between;
    return only;
}