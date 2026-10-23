import React from 'react';
import { Box } from '@mui/material';
import { ChevronRightIcon } from '../icons/DriveIcons';

export const DriveBreadcrumbs = ({ crumbs, handleNavigateToIndex, C }) => {
  return (
    <Box
      component="nav"
      aria-label="Đường dẫn thư mục"
      sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 0.5, minWidth: 0, fontSize: { xs: 14, md: 18 } }}
    >
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <React.Fragment key={crumb.id}>
            {i > 0 && (
              <Box component="span" aria-hidden="true" sx={{ display: 'inline-flex', color: C.textSub }}>
                <ChevronRightIcon size={16} strokeWidth={2} />
              </Box>
            )}
            <Box
              component="span"
              title={crumb.name}
              role={isLast ? undefined : 'button'}
              tabIndex={isLast ? -1 : 0}
              aria-current={isLast ? 'page' : undefined}
              onClick={() => !isLast && handleNavigateToIndex(crumb.index)}
              onKeyDown={(e) => { if (!isLast && e.key === 'Enter') handleNavigateToIndex(crumb.index); }}
              sx={{
                maxWidth: { xs: 120, md: 240 },
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                fontWeight: isLast ? 500 : 400,
                color: isLast ? C.text : C.textSub,
                cursor: isLast ? 'default' : 'pointer',
                '&:hover': isLast ? {} : { color: C.text, textDecoration: 'underline' }
              }}
            >
              {crumb.name}
            </Box>
          </React.Fragment>
        );
      })}
    </Box>
  );
};