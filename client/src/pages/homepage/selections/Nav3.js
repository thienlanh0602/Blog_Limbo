import React from "react";
import { Box, Typography } from "@mui/material";
import { StyleTypography_2 } from "../../../components/homepage/home";

// ===================== Image Item =====================
const ImageItem = ({ img }) => (
  <Box
    sx={{
      flex: "0 0 33.33%", // mỗi ảnh chiếm 1/3
      maxWidth: "33.33%",
      position: "relative",
      overflow: "hidden",
    }}
  >
    {/* Khung giữ tỷ lệ */}
    <Box sx={{ width: "99%", paddingTop: "75%" }} />
    {/* Ảnh fill khung */}
    <Box
      component="img"
      src={`http://localhost:5000${img}`}
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

// ===================== Main Component =====================
const Nav3 = ({ item }) => {
  if (!item) return null;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 4,
      }}
    >
      {/* Title */}
      <Box textAlign="center">
        <Typography fontWeight={800} fontSize={34} textTransform="uppercase">
          {item.title}
        </Typography>
        <StyleTypography_2>{item.title_2}</StyleTypography_2>
      </Box>

      {/* Image Grid */}
      {Array.isArray(item.image) && item.image.length > 0 && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", width: "99.6vw" }}>
            {item.image.map((img, idx) => (
              <ImageItem key={idx} img={img} />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Nav3;
