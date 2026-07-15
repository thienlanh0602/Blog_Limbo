import { Box, Container, useTheme } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import ChatBubble from "../../../components/homepage/selections/component_2/ChatBuble";
import { breakpoints } from "../../../theme/breakpoints";
import { commonSxDisplay } from "../../../components/homepage/home";
import TypingDots from "../../../components/homepage/selections/component_2/TypingDot";

// Hook detect scroll vào viewport
const useInView = (threshold = 0.2) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
};

const AnimatedBubble = ({ children, delay = 0, align = "right" }) => {
  const { ref, inView } = useInView(0.1);

  return (
    <Box
      ref={ref}
      sx={{
        opacity: inView ? 1 : 0,
        transform: inView
          ? "translateY(0)"
          : align === "right"
            ? "translateX(40px)"   // slide từ phải vào
            : "translateX(-40px)", // slide từ trái vào
        transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
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
        background: "linear-gradient(270deg, #E2FDE9, #29f0c4, #E2FDE9)",
        backgroundSize: "400% 400%",
        animation: "gradientShift 6s ease infinite",
        minHeight: { xs: 420, sm: 500, md: 800 },
        height: { xs: "auto", md: 600 },
        py: { xs: 4, md: 0 },
        width: "100%",
        overflow: "hidden",
        "@keyframes gradientShift": {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
      }}
    >
      <Box sx={{
        position: "absolute",
        width: { xs: 200, md: 400 },
        height: { xs: 200, md: 400 },
        borderRadius: "50%",
        background: "radial-gradient(circle, #29f0c4aa, transparent)",
        top: "-10%",
        left: "-5%",
        filter: "blur(40px)",
        animation: "blobFloat 8s ease-in-out infinite",
        "@keyframes blobFloat": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(30px, -20px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 15px) scale(0.95)" },
        },
      }} />

      <Box sx={{
        position: "absolute",
        width: { xs: 150, md: 300 },
        height: { xs: 150, md: 300 },
        borderRadius: "50%",
        background: "radial-gradient(circle, #E2FDE9cc, transparent)",
        bottom: "5%",
        right: "5%",
        filter: "blur(50px)",
        animation: "blobFloat 10s ease-in-out infinite reverse",
      }} />
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
        <Box sx={{ position: "relative", height: 600 }}>

          <Box sx={{ position: "absolute", top: { xs: '16%', sm: '12%', md: "15%" }, right: { xs: '6%', sm: '12%', md: "18%" } }}>
            <AnimatedBubble delay={800} align="right">
              <ChatBubble
                text={item.title}
                img={item.image}
                align="right"
                time="00:00"
              />
            </AnimatedBubble>
          </Box>

          <Box sx={{ position: "absolute", top: { xs: '48%', sm: '48%', md: "45%" }, left: { xs: '8%', sm: '12%', md: "18%" } }}>
            <AnimatedBubble delay={2800} align="left">
              <ChatBubble
                text={item.title_2}
                img={item.image}
                align="left"
                time="00:01"
              />
            </AnimatedBubble>
          </Box>

          <Box sx={{ position: "absolute", top: { xs: '74%', sm: '75%', md: "70%" }, right: { xs: '6%', sm: '12%', md: "18%" } }}>
            <AnimatedBubble delay={4000} align="right">
              <ChatBubble
                img={item.image}
                align="right"
                time="00:02"
              >
                <TypingDots color="black" size={{ xs: 4, sm: 6, md: 8 }} speed={1} />
              </ChatBubble>
            </AnimatedBubble>
          </Box>

        </Box>
      </Container>

    </Box >



  );
};

export default Nav2;