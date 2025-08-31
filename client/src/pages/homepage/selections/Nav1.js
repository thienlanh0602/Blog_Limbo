// sections/Nav1.jsx
import { Box, Typography, Button } from "@mui/material";
import { StyleTypography_1, StyleTypography_2, BoxImageHome } from "../../../components/homepage/home";
import Arrow from "../../../assets/Arrow_1.svg";
import SvgNav1 from "../../../assets/square_dashed.svg";

export default function Nav1({ item }) {
  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: 2,
      }}
    >
      {/* Background SVG */}
      <Box
        component="img"
        src={SvgNav1}
        alt="decor"
        sx={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 0,
          opacity: 0.7,
          maxWidth: "100%",
        }}
      />

      {/* Title */}
      <StyleTypography_1>{item.title}</StyleTypography_1>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          textTransform: "uppercase",
          color: "#4DF4C8",
        }}
      >
        @ IM THIEN LANH
      </Typography>
      <StyleTypography_2>{item.title_2}</StyleTypography_2>

      {/* Button */}
      <Button
        onMouseDown={(e) => e.preventDefault()}
        onClick={(e) => e.currentTarget.blur()}
        sx={{
          mt: 1,
          minWidth: 150,
          minHeight: 50,
          borderRadius: 0,
          fontSize: 16,
          color: "black",
          backgroundColor: "#4efcd3",
          border: "2px solid black",
          boxShadow: "3px 3px 0px black",
          "&:hover": { backgroundColor: "#4efcd3" },
          "&:active": {
            backgroundColor: "#4efcd3",
            boxShadow: "1px 1px 0px black",
            transform: "translate(1px, 1px)",
          },
        }}
      >
        <BoxImageHome component="img" src={Arrow} />
      </Button>
    </Box>
  );
}
