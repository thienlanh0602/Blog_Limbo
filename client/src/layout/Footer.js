import { Box, Typography, IconButton } from "@mui/material";

const tools = ["FIGMA", "VISUALCODE", "BLENDER", "ILLUSTRATOR"];

const columnSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
};

const textSx = {
  fontSize: { xs: 16, sm: 18, md: 24 },
  fontWeight: 500,
};

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
        alignItems: "center",
        borderTop: "0.5px solid rgba(0, 0, 0, 0.2)",
        rowGap: { xs: 2, md: 0 },
        py: { xs: 3, md: 4 },
        px: { xs: 2, md: 6 },
        boxSizing: "border-box",
      }}
    >
      {/* Cột 1: sát trái (md), giữa (xs) */}
      <Box
        sx={{
          ...columnSx,
          justifyContent: { xs: "center", md: "flex-start" },
          textAlign: { xs: "center", md: "left" },
          order: { xs: 3, md: 1 },
        }}
      >
        <Typography sx={textSx}>@2025_limbo/thienlanh</Typography>
      </Box>

      {/* Cột 2: giữa */}
      <Box
        sx={{
          ...columnSx,
          flexWrap: "wrap",
          columnGap: { xs: 1.5, md: 2 },
          rowGap: 0.5,
          order: { xs: 2, md: 2 },
        }}
      >
        {tools.map((tool) => (
          <Typography key={tool} sx={textSx}>
            {tool}
          </Typography>
        ))}
      </Box>

      {/* Cột 3: sát phải (md), giữa (xs) */}
      <Box
        sx={{
          ...columnSx,
          justifyContent: { xs: "center", md: "flex-end" },
          gap: { xs: 0.5, md: 1 },
          order: { xs: 1, md: 3 },
        }}
      >
        <Typography sx={textSx}>Ca Mau, Viet Nam</Typography>

      </Box>
    </Box>
  );
}

export default Footer;