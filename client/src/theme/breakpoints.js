export const breakpoints = (theme) => ({
  mobile: theme.breakpoints.down('md'),
  tablet: theme.breakpoints.between('sm', 'md'),
  desktop: theme.breakpoints.up('lg'),
});

export const DRAWER_WIDTH = 280;
