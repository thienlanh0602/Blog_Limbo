import { Box, Container, Typography } from "@mui/material";
import FrameNav2 from "../../../assets/frame.svg";

// ===================== Chat Bubble =====================
const ChatBubble = ({ text, img, align = "right", time }) => {
  const isRight = align === "right";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        position: "absolute",
        justifyContent: "center",
        alignItems: isRight ? "flex-end" : "flex-start",
        gap: 2,
        ...(isRight
          ? { top: "30%", right: "5%", transform: "translateX(-50%)" }
          : { top: "60%", left: "29%", transform: "translateX(-50%)" }),
      }}
    >
      {/* Bubble */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
          backgroundColor: "#fff",
          border: "1px solid #000",
          borderRadius: "30px",
          p: 2.5,
          alignItems: "center",
          width: "fit-content",
          zIndex: 2,
        }}
      >
        {!isRight && (
          <Box
            component="img"
            src={`http://localhost:5000${img}`}
            alt="Avatar"
            sx={{ width: 55, height: 55, transform: "scaleX(-1)" }}
          />
        )}
        <Typography sx={{ fontWeight: 300 }}>{text}</Typography>
        {isRight && (
          <Box
            component="img"
            src={`http://localhost:5000${img}`}
            alt="Avatar"
            sx={{ width: 55, height: 55 }}
          />
        )}
      </Box>

      {/* Time */}
      <Typography
        sx={{
          fontWeight: 300,
          zIndex: 2,
          fontSize: 14,
          ...(isRight ? { mr: 2 } : { ml: 2 }),
        }}
      >
        {time}
      </Typography>
    </Box>
  );
};

// ===================== Main Component =====================
const Nav2 = ({ item }) => {
  if (!item) return null;

  return (
    <Box
      sx={{
        position: "relative",
        background: "linear-gradient(180deg, #E2FDE9, #29f0c4)",
        height: 600,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container
        sx={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* SVG khung */}
        <Box
          component="img"
          src={FrameNav2}
          alt="decor"
          sx={{ width: "80%", height: "auto", position: "relative", zIndex: 0 }}
        />

        {/* Chat bubbles */}
        <ChatBubble text={item.title} img={item.image} align="right" time="00:00" />
        <ChatBubble text={item.title_2} img={item.image} align="left" time="00:01" />

        {/* Avatar + text trên cùng */}
        <Box
          sx={{
            display: "flex",
            position: "absolute",
            top: "6%",
            left: "16%",
            zIndex: 2,
          }}
        >
          <Box
            component="img"
            src={`http://localhost:5000${item.image}`}
            alt="Avatar"
            sx={{ width: 60, height: 60, mr: 2, transform: "scaleX(-1)" }}
          />
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: 'center' }}>
            <Typography sx={{ fontSize: 16, fontWeight: 600 }}>Thiên Lảnh</Typography>
            <Typography sx={{ color: "gray", fontSize: 12, fontWeight: 300 }}>
              Đang nhập...
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Nav2;
