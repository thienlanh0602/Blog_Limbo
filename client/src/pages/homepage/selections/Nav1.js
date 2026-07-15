import { Box, useTheme, Tooltip } from "@mui/material";
import { BoxImageHome, commonSxDisplay } from "../../../components/homepage/home";
import { STATIC_IMAGES } from '../../../utils/Staticimages';
import { optimizeCloudinaryUrl } from '../../../utils/Cloudinaryhelper';
import { TextTitle } from "../../../components/homepage/selections/component_1/TextTitle";
import { breakpoints } from "../../../theme/breakpoints";
import { ContextTag } from "../../../components/homepage/selections/component_1/ContextTag";
import { Context } from "../../../components/homepage/selections/component_1/Context";
import { ButtonLink } from "../../../components/homepage/selections/component_1/ButtonLink";

export default function Nav1({ item }) {

  const theme = useTheme();
  const bp = breakpoints(theme);

  return (
    <Box
      sx={{
        ...commonSxDisplay,
        flexDirection: "column",
        textAlign: "center",
        gap: 2,
        position: "relative",
        px: { xs: 2, md: 0 },
        width: '100%',
        pt: { xs: 34, sm: 14, md: 18 },
        pb: { xs: 16},
      }}
    >
      <Box
        component="img"
        src={optimizeCloudinaryUrl(STATIC_IMAGES.start_2, 300)}
        alt="star decor large"
        sx={{
          position: "absolute",
          top: { xs: '45%', md: '28%' },
          right: { xs: '20%', md: '30%' },
          width: { xs: 28, md: 60 },
          zIndex: 10, 
          pointerEvents: "none",

          animation: "spinScaleLarge 4s infinite ease-in-out",

          "@keyframes spinScaleLarge": {
            "0%": {
              transform: "scale(0) rotate(0deg)",
              opacity: 0,
            },
            "15%": {
              transform: "scale(1) rotate(180deg)",
              opacity: 1,
            },
            "30%": {
              transform: "scale(0.7) rotate(360deg)",
              opacity: 1,
            },
            "45%": {
              transform: "scale(0) rotate(540deg)",
              opacity: 0,
            },
            "100%": {
              transform: "scale(0) rotate(540deg)",
              opacity: 0,
            }
          }
        }}
      />

      <Box
        component="img"
        src={optimizeCloudinaryUrl(STATIC_IMAGES.start_1, 300)}
        alt="star decor small"
        sx={{
          position: "absolute",
          top: { xs: '48%', md: '36%' },
          right: { xs: '75%', md: '70%' },
          width: { xs: 40, md: 60 },
          zIndex: 10,
          pointerEvents: "none",

          animation: "spinScaleSmall 3s infinite ease-in-out",

          "@keyframes spinScaleSmall": {
            "0%": {
              transform: "scale(0) rotate(0deg)",
              opacity: 0,
            },
            "15%": {
              transform: "scale(0.7) rotate(180deg)",
              opacity: 1,
            },
            "30%": {
              transform: "scale(0.5) rotate(360deg)",
              opacity: 1,
            },
            "45%": {
              transform: "scale(0) rotate(540deg)",
              opacity: 0,
            },
            "100%": {
              transform: "scale(0) rotate(540deg)",
              opacity: 0,
            }
          }
        }}
      />

      <Box
        component="img"
        src={optimizeCloudinaryUrl(STATIC_IMAGES.nav_1, 1200)}
        alt="decor"
        sx={{
          position: "absolute",
          left: { xs: "50%", md: "50%" },
          top: { xs: "40%", md: "20%" },
          transform: "translateX(-50%)",
          pointerEvents: "none",
          zIndex: 0,
          opacity: 0.7,
          maxWidth: { xs: "100%", md: "100%" },
          width: { xs: 280, sm: 400, md: "auto" },
        }}
      />

      <TextTitle theme={theme} bp={bp}>{item.title}</TextTitle>
      <ContextTag>
        @ IM THIEN LANH
      </ContextTag>

      <Context theme={theme} bp={bp}>{item.title_2}</Context>

      <Tooltip
        title="Để nút vậy thôi chứ không nhấn được"
        arrow
        placement="top"
        componentsProps={{
          tooltip: {
            sx: {
              bgcolor: "black",
              color: "white",
              fontSize: 12,
              border: "1px solid black",
              boxShadow: "2px 2px 0px black",
            },
          },
          arrow: {
            sx: {
              color: "black",
            },
          },
        }} >

        <ButtonLink>
          <BoxImageHome component="img" src={optimizeCloudinaryUrl(STATIC_IMAGES.arrow, 30)} />
        </ButtonLink>
      </Tooltip>
    </Box>
  );
}