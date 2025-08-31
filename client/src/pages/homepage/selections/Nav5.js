import { Box, Container } from "@mui/material";
import { StyleTypography_3, StyleTypography_2 } from "../../../components/homepage/home";

// ===================== Step Item =====================
const StepItem = ({ title, title_2 }) => (
  <Box>
    <StyleTypography_3>{title}</StyleTypography_3>

    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        position: "relative",
        pb: 4,
      }}
    >
      {/* Chấm tròn */}
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

      {/* Đường nối */}
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

      {/* Nội dung */}
      <Box>
        <StyleTypography_2>{title_2}</StyleTypography_2>
      </Box>
    </Box>
  </Box>
);

// ===================== Main Component =====================
const Nav5 = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: 10,
        borderWidth: 1.9,
        borderStyle: "dashed",
        borderColor: "#ccc",
        borderRadius: 5,
        maxWidth: 800,
        mx: "auto",
      }}
    >
      {items.map((i, idx) => (
        <StepItem key={idx} title={i.title} title_2={i.title_2} />
      ))}
    </Container>
  );
};

export default Nav5;
