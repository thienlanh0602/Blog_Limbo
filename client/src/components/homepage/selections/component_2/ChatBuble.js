import { Box, Typography } from "@mui/material";
import { optimizeCloudinaryUrl } from '../../../../utils/Cloudinaryhelper';


const ChatBubble = ({ text, children, img, align = "right", time }) => {
  const isRight = align === "right";

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: isRight ? "flex-end" : "flex-start",
        gap: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: { xs: 1, md: 2 },
          backgroundColor: "#fff",
          border: "1px solid #000",
          boxShadow: "-6px 10px 0px #8D87F5",
          borderRadius: { xs: "16px", sm: "20px", md: "30px" },
          px: { xs: 1.5, md: 2.5 },
          py: { xs: 1, md: 2 },
          maxWidth: { xs: "85%", sm: "70%", md: "100%" },
          width: "fit-content",
        }}
      >
        {!isRight && (
          <Box
            component="img"
            src={optimizeCloudinaryUrl(img?.[1], 800)}
            alt="Avatar"
            sx={{
              width: { xs: 20, sm: 30, md: 40 },
              height: { xs: 24, sm: 36, md: 46 },
              flexShrink: 0,
            }}
          />
        )}

        {children ? (
          children
        ) : (
          <Typography
            sx={{
              fontSize: { xs: 12, sm: 14, md: 16 },
              fontWeight: 300,
              whiteSpace: "normal",
              overflowWrap: "break-word",
              maxWidth: { xs: 150, sm: 220, md: 300 },
            }}
          >
            {text}
          </Typography>
        )}

        {isRight && (
          <Box
            component="img"
            src={optimizeCloudinaryUrl(img?.[0], 800)}
            alt="Avatar"
            sx={{
              width: { xs: 20, sm: 30, md: 40 },
              height: { xs: 24, sm: 36, md: 46 },
              flexShrink: 0,
            }}
          />
        )}
      </Box>

      <Typography sx={{ fontSize: { xs: 11, md: 14 }, fontWeight: 300, px: 1 }}>
        {time}
      </Typography>
    </Box>
  );
};


export default ChatBubble;