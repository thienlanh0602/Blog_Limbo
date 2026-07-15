import { Box, Container, Typography, Button } from "@mui/material";
import { STATIC_IMAGES } from '../../../utils/Staticimages';
import { optimizeCloudinaryUrl } from '../../../utils/Cloudinaryhelper';
import { StyleTypography_3, StyleTypography_Text, StyleTypography_Title, commonSxDisplay } from "../../../components/homepage/home";

const StepItem = ({ title, title_2 }) => (
  <Box>
    <StyleTypography_3>{title}</StyleTypography_3>

    <Box
      sx={{
        ...commonSxDisplay,
        gap: 2,
        position: "relative",
        flexDirection: "column",
        pb: 4,
      }}
    >
      <Box
        sx={{
          width: 14,
          height: 14,
          borderRadius: "50%",
          bgcolor: "black",
          flexShrink: 0,
          position: "relative",
          zIndex: 1,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          top: 14,
          width: 2,
          height: 10,
          bgcolor: "black",
          zIndex: 0,
        }}
      />

      <Box sx={{ px: { xs: 1, md: 0 } }}>
        <StyleTypography_Text>{title_2}</StyleTypography_Text>
      </Box>
    </Box>
  </Box>
);
const Nav5 = ({ header, items }) => {
  if (!header || !items || items.length === 0) return null;
  const sortedItems = items.toSorted((a, b) => {
    const yearA = parseInt(a.title);
    const yearB = parseInt(b.title);
    return yearA - yearB;
  });

  return (
    <Box sx={{
      ...commonSxDisplay,
      flexDirection: "column",
      gap: { xs: 3, md: 4 },
      width: '100%',
      px: { xs: 2, sm: 3, md: 0 },
      boxSizing: 'border-box',
    }}>
      <Box sx={{
        ...commonSxDisplay,
        flexDirection: 'column',
      }}>
        <StyleTypography_Title>{header.title}</StyleTypography_Title>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          <StyleTypography_Text>{header.title_2}</StyleTypography_Text>
          <Button
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => e.currentTarget.blur()}
            sx={{
              minWidth: { xs: 32, md: 36 },
              minHeight: { xs: 20, md: 24 },
              mb: 1,
              ml: { xs: 1, md: 2 },
              borderRadius: 0,
              color: "black",
              backgroundColor: "#4efcd3",
              border: "1px solid black",
              boxShadow: "2px 2px 0px black",
              verticalAlign: "middle",
              "&:hover": { backgroundColor: "#4efcd3" },
              "&:active": {
                backgroundColor: "#4efcd3",
                boxShadow: "1px 1px 0px black",
                transform: "translate(1px, 1px)",
              },
            }}
          >
            <Box sx={{ width: 10, height: 10 }} component="img" src={optimizeCloudinaryUrl(STATIC_IMAGES.arrow, 30)} />
          </Button>
        </Box>
      </Box>
      <Container
        sx={{
          ...commonSxDisplay,
          flexDirection: "column",
          p: { xs: 3, sm: 5, md: 10 },
          borderWidth: 1.9,
          borderStyle: "dashed",
          borderColor: "#ccc",
          borderRadius: { xs: 3, md: 5 },
          maxWidth: { xs: "95%", sm: 700, md: 800 },
          mx: "auto",
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {sortedItems.map((i) => (
          <StepItem key={i._id} title={i.title} title_2={i.title_2} />
        ))}
      </Container>
    </Box>
  );
};

export default Nav5;
