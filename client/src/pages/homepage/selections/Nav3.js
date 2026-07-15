import { Box } from "@mui/material";
import { commonSxDisplay, StyleTypography_Text, StyleTypography_Title } from "../../../components/homepage/home";
import { optimizeCloudinaryUrl } from '../../../utils/Cloudinaryhelper';

const ImageItem = ({ img }) => (
  <Box
    sx={{
      position: "relative",
      overflow: "hidden",
      width: "100%",
    }}
  >
    <Box sx={{ width: "100%", paddingTop: "100%" }} />
    <Box
      component="img"
      src={optimizeCloudinaryUrl(img, 800)}
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
    />
  </Box>
);

const Nav3 = ({ item }) => {
  if (!item) return null;

  return (
    <Box
      sx={{
        ...commonSxDisplay,
        flexDirection: "column",
        gap: { xs: 3, md: 4 },
        width: '100%',
        px: { xs: 2, sm: 3, md: 0 },
        boxSizing: 'border-box',
      }}
    >
      <Box sx={{
        ...commonSxDisplay,
        flexDirection: 'column',
      }} >
        <StyleTypography_Title>
          {item.title}
        </StyleTypography_Title>
        <StyleTypography_Text>{item.title_2}</StyleTypography_Text>
      </Box>

      {Array.isArray(item.image) && item.image.length > 0 && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "1fr 1fr 1fr",
            },
            // gap: { xs: 2, sm: 3, md: 4 },
            width: "100%",
            maxWidth: "100%",
          }}
        >
          {item.image.map((img) => (
            <ImageItem key={img} img={img} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Nav3;
