import { Box, Container, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import ChatBubble from "../../../components/homepage/selections/component_2/ChatBuble";
import { breakpoints } from "../../../theme/breakpoints";
import { commonSxDisplay } from "../../../components/homepage/home";
import TypingDots from "../../../components/homepage/selections/component_2/TypingDot";

// Nội dung title 3 viết tay (không lấy từ database)
const TITLE_3 = "Mày không có bạn bè à?";

// Hook tính tiến độ hiện (0 -> 1) theo vị trí scroll
const useScrollReveal = (startRatio = 0.95, endRatio = 0.65) => {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      ticking = false;
      if (!ref.current) return;
      const top = ref.current.getBoundingClientRect().top;
      const vh = window.innerHeight;
      const start = vh * startRatio;
      const end = vh * endRatio;
      const p = (start - top) / (start - end);
      setProgress(Math.min(Math.max(p, 0), 1));
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [startRatio, endRatio]);

  return { ref, progress };
};

const AnimatedBubble = ({ children, align = "right" }) => {
  const { ref, progress } = useScrollReveal();
  const offset = (1 - progress) * 40;

  return (
    <Box
      ref={ref}
      sx={{
        opacity: progress,
        transform: `translateX(${align === "right" ? offset : -offset}px)`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </Box>
  );
};

const Nav2 = ({ item }) => {
  const theme = useTheme();
  const bp = breakpoints(theme);
  if (!item) return null;

  return (
    <Box
      sx={{
        ...commonSxDisplay,
        position: "relative",
        // backgroundColor: "#4EFCD3", // màu nền cố định
        minHeight: { xs: 320, sm: 500, md: 1200 },
        height: { xs: "auto", md: 600 },
        pt: { xs: 26, },
        width: "100%",
        overflow: "hidden",
      }}
    >
      <Container
        sx={{
          position: "relative",
          px: { xs: 2, md: 3 },
          display: "flex",
          flexDirection: "column",
          gap: { xs: 6, md: 8 },
          py: { xs: 4, md: 40 },
        }}
      >
        <Box sx={{ position: "relative", height: { xs: 780, md: 860 } }}>

          {/* Tin 1: title (phải) */}
          <Box sx={{ position: "absolute", top: "4%", right: { xs: "6%", sm: "12%", md: "18%" } }}>
            <AnimatedBubble align="right">
              <ChatBubble
                text={item.title}
                img={item.image}
                align="right"
                bgColor="#4EFCD3"
                seen
                seenImg={item.image?.[1]}
                time="00:00"
              />
            </AnimatedBubble>
          </Box>

          {/* Tin 2: title_2 (trái) */}
          <Box sx={{ position: "absolute", top: "26%", left: { xs: "8%", sm: "12%", md: "18%" } }}>
            <AnimatedBubble align="left">
              <ChatBubble
                text={item.title_2}
                img={item.image}
                align="left"
                time="00:01"
              />
            </AnimatedBubble>
          </Box>

          {/* Tin 3: title 3 viết tay (trái) */}
          <Box sx={{ position: "absolute", top: "48%", left: { xs: "8%", sm: "12%", md: "18%" } }}>
            <AnimatedBubble align="left">
              <ChatBubble
                text={TITLE_3}
                img={item.image}
                align="left"
                time="00:02"
              />
            </AnimatedBubble>
          </Box>

          {/* Tin 4: đang gõ (phải) */}
          <Box sx={{ position: "absolute", top: "70%", right: { xs: "6%", sm: "12%", md: "18%" } }}>
            <AnimatedBubble align="right">
              <ChatBubble
                img={item.image}
                align="right"
                time="00:03"
                bgColor="#4EFCD3"
              >
                <TypingDots color="black" size={{ xs: 4, sm: 6, md: 7 }} speed={1} />
              </ChatBubble>
            </AnimatedBubble>
          </Box>

        </Box>
      </Container>
    </Box>
  );
};

export default Nav2;