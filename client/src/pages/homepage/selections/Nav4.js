import { useEffect, useRef, useState } from "react";
import { Box, Typography, CardMedia } from "@mui/material";

const played = new Set();

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

const useRevealOnce = (id) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(() => played.has(id));

  useEffect(() => {
    if (played.has(id)) return;

    const el = ref.current;
    if (!el) return;

    // Không có IntersectionObserver thì mới hiện luôn
    if (!("IntersectionObserver" in window)) {
      played.add(id);
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          played.add(id);
          setVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0,
        rootMargin: "0px 0px -10% 0px", // lọt vào 10% từ đáy màn hình là chạy
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [id]);

  return [ref, visible];
};

// Style hiện dần + trượt nhẹ lên
const fade = (visible, delay) => ({
  opacity: visible ? 1 : 0,
  transform: visible ? "translateY(0)" : "translateY(28px)",
  transition: `opacity 0.8s ease ${delay}s, transform 0.9s ${EASE} ${delay}s`,
  willChange: "opacity, transform",
});

const HighlightText = ({ text }) => {
  if (!text?.includes("Ân")) return <>{text}</>;

  const [before, after] = text.split("Ân");

  return (
    <>
      {before}
      <br />
      {"Ân" + after}
    </>
  );
};

const CardItem = ({ card }) => {
  const [ref, visible] = useRevealOnce(card._id);

  return (
    <Box
      ref={ref}
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "flex-start", sm: "center" },
        gap: 2,
        mb: 8,
      }}
    >
      {/* Phần 1: ảnh + tiêu đề nhỏ, hiện trước */}
      <Box
        sx={{
          flexShrink: 0,
          width: { xs: 100, md: 130 },
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          alignSelf: "flex-start",
          gap: 1,
          ...fade(visible, 0),
        }}
      >
        <CardMedia
          component="img"
          src={card.image}
          alt={card.title}
          sx={{
            width: "40%",
            objectFit: "contain",
            transition: "transform 0.3s ease",
            "&:hover": { transform: "scale(1.1)" },
          }}
        />
        <Typography
          sx={{ fontSize: { xs: 16, md: 18 }, fontWeight: 300, textAlign: "left" }}
        >
          <HighlightText text={card.title} />
        </Typography>
      </Box>

      {/* Phần 2: nội dung, hiện sau 0.25s */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignSelf: "flex-start",
          ...fade(visible, 0.25),
        }}
      >
        <Typography
          sx={{
            fontWeight: 500,
            textAlign: "left",
            fontSize: { xs: 20, md: 24 },
          }}
        >
          <HighlightText text={card.title_2} />
        </Typography>
      </Box>
    </Box>
  );
};

const Nav4 = ({ header, cards = [] }) => {
  if (!header) return null;

  return (
    // Lớp ngoài: full chiều rộng (để nền, nếu có, phủ hết)
    <Box sx={{ width: "100%" }}>
      {/* Lớp trong: khóa chiều rộng thiết kế, canh giữa */}
      <Box
        sx={{
          width: "100%",
          maxWidth: 1440,
          mx: "auto",
          boxSizing: "border-box",
          py: { xs: 6, md: 24 },
          px: { xs: 4, sm: 3, md: 10 },
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 2fr" },
          columnGap: { md: 6 },
          rowGap: { xs: 4, md: 0 },
          alignItems: "start",
        }}
      >
        {/* Cột 1: đứng yên, không hiệu ứng */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            textAlign: "left",
            position: { md: "sticky" },
            top: { md: 100 },
          }}
        >
          <Typography
            component="span"
            sx={{
              alignSelf: "flex-start",
              borderRadius: "3px",
              fontSize: 20,
              letterSpacing: 0.3,
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            {header.title}
          </Typography>

          <Typography
            component="span"
            sx={{
              alignSelf: "flex-start",
              borderRadius: "3px",
              fontSize: { xs: 28, md: 32 },
              letterSpacing: 0.3,
              fontWeight: 300,
            }}
          >
            {header.title_2}
          </Typography>
        </Box>

        {/* Cột 2: mỗi card tự hiện khi cuộn tới */}
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          {cards.map((card) => (
            <CardItem key={card._id} card={card} />
          ))}
        </Box>

        {/* Cột 3 */}
        <Box
          sx={{
            position: { md: "sticky" },
            top: { md: 100 },
          }}
        >
          <Typography
            sx={{
              fontWeight: 300,
              fontSize: { xs: 15, md: 18 },
              lineHeight: 1.5,
              textAlign: "left",
              whiteSpace: "pre-line",
            }}
          >
            {header.content}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Nav4;