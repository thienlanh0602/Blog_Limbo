import { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { STATIC_IMAGES } from '../utils/Staticimages';
import { optimizeCloudinaryUrl } from '../utils/Cloudinaryhelper';

export default function IntroScreen({ onFinish = () => { }, text = "Hey" }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof onFinish === 'function')
        onFinish();
    }, 3200);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        backgroundColor: "#0B0B0B",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        zIndex: 99999,
      }}
    >
      <Typography
        sx={{
          position: "absolute",
          color: "#fff",
          fontSize: { xs: "3rem", md: "5.5rem" },
          fontWeight: "900",
          letterSpacing: "6px",
          textTransform: "uppercase",

          animation: "heyAnim 1.8s cubic-bezier(0.215, 0.610, 0.355, 1) forwards",

          "@keyframes heyAnim": {
            "0%": {
              transform: "scaleY(0.4) scaleX(1.3) translateY(60px)",
              opacity: 0,
            },
            "15%": {
              opacity: 1,
            },
            "38%": {
              transform: "scaleY(1.28) scaleX(0.86) translateY(-14px)",
            },
            "58%": {
              transform: "scaleY(0.95) scaleX(1.05) translateY(4px)",
            },
            "78%": {
              transform: "scaleY(1) scaleX(1) translateY(0)",
              opacity: 1,
            },
            "100%": {
              transform: "scale(0.9) translateY(-10px)",
              opacity: 0,
            },
          },
        }}
      >
        {/* Chữ hiển thị giờ lấy từ prop `text`, mặc định vẫn là "Hey" để không phá các chỗ
            đang gọi <IntroScreen /> mà chưa truyền prop này */}
        {text}
      </Typography>

      <Box
        component="img"
        src={optimizeCloudinaryUrl(STATIC_IMAGES.logo_intro, 1000)}
        alt="logo"
        sx={{
          position: "absolute",
          width: { xs: 110, md: 160 },
          opacity: 0,

          animation: "logoPop 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards",
          animationDelay: "1.4s",

          "@keyframes logoPop": {
            "0%": {
              transform: "scale(0.3)",
              opacity: 0,
            },
            "16%": {
              opacity: 1,
            },
            "42%": {
              transform: "scale(1.18)",
            },
            "62%": {
              transform: "scale(0.94)",
            },
            "78%": {
              transform: "scale(1)",
              opacity: 1,
            },
            "100%": {
              transform: "scale(0.3)",
              opacity: 0,
            },
          },
        }}
      />
    </Box>
  );
}