import { Box, Typography } from "@mui/material";
import { optimizeCloudinaryUrl } from "../../../../utils/Cloudinaryhelper";

const ChatBubble = ({
  text,
  children,
  img,
  align = "right",
  time,
  bgColor = "#8D87F5",
  seen = false,
  seenImg,
}) => {
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
          backgroundColor: bgColor,
          // border: "1px solid #000",
          // boxShadow: "-6px 10px 0px #8D87F5",
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
              textAlign: isRight ? "right" : "left",
              fontSize: { xs: 12, sm: 14, md: 16 },
              fontWeight: 400,
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

      <Box
        sx={{
          display: "flex",
          flexDirection: isRight ? "row-reverse" : "row", // tin phải: giờ sát phải, avatar và "Đã xem" nằm bên trái giờ
          alignItems: "center",
          gap: 0.75,
          pl: isRight ? 1 : 1,
          pr: isRight ? 1 : 1, // tin phải: bỏ đệm bên phải để giờ sát mép bong bóng
        }}
      >
        <Typography sx={{ fontSize: { xs: 11, md: 14 }, fontWeight: 300, mr: isRight ? 0 : 1, ml: isRight ? 1 : 0 }}>
          {time}
        </Typography>

        {seen && (
          <>
            <Box
              component="img"
              src={optimizeCloudinaryUrl(seenImg, 200)}
              alt="Avatar"
              sx={{
                width: { xs: 12, md: 16 },
                height: { xs: 14, md: 19 },
                objectFit: "contain",
                flexShrink: 0,
              }}
            />
            <Typography sx={{ fontSize: { xs: 11, md: 14 }, fontWeight: 300 }}>
              Đã xem
            </Typography>
          </>
        )}
      </Box>
    </Box>
  );
};

export default ChatBubble;