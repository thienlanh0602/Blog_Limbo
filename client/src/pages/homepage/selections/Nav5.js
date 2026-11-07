import { useEffect, useRef, useState } from "react";
import { Box, Typography, CardMedia } from "@mui/material";

const DOT_TOP = 14; // vị trí chấm tròn tính từ đầu mỗi mốc (px)
const ACTIVE_COLOR = "#4EFCD3"; // màu xanh khi scroll
const LINE_COLOR = "rgba(0,0,0,0.2)";

const DOT_RADIUS = 6; // bán kính chấm tròn (width 12px / 2)
const LINE_EXTEND = 50; // line nhô ra ngoài mép chấm đầu và chấm cuối (px)
const EXTEND = DOT_RADIUS + LINE_EXTEND; // tính từ tâm chấm

// Vị trí ngang của đường kẻ = cột năm + gap + nửa cột chấm
const LINE_LEFT = { xs: "52.9px", md: "89.5px" };

// ===== Hiệu ứng hiện dần khi cuộn tới (chạy 1 lần, F5 mới chạy lại) =====
const played = new Set(); // nằm ngoài component: chuyển trang trong SPA không chạy lại

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

const useRevealOnce = (id) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(() => played.has(id));

  useEffect(() => {
    if (played.has(id)) return;

    const el = ref.current;
    if (!el) return;

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

const fade = (visible, delay) => ({
  opacity: visible ? 1 : 0,
  transform: visible ? "translateY(0)" : "translateY(28px)",
  transition: `opacity 0.8s ease ${delay}s, transform 0.9s ${EASE} ${delay}s`,
  willChange: "opacity, transform",
});

// ===== Một mốc timeline =====
const StepItem = ({ item, active, id }) => {
  const [ref, visible] = useRevealOnce(id);
  const [head, ...rest] = (item.title_2 || "").split("\n");
  const body = rest.join("\n").trim();

  return (
    <Box
      ref={ref}
      data-step
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "34px 24px 1fr", md: "50px 48px 1fr" },
        columnGap: { xs: 1, md: 2 },
        pb: { xs: 5, md: 8 },
      }}
    >
      {/* Cột năm + ảnh: hiện trước */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          ...fade(visible, 0),
        }}
      >
        <Typography
          sx={{
            textAlign: "right",
            fontSize: { xs: 16, md: 18 },
            fontWeight: 300,
            lineHeight: "28px",
            pt: 0.25,
          }}
        >
          {item.title}
        </Typography>

        <CardMedia
          component="img"
          src={item.image}
          alt={item.title}
          sx={{
            width: "100%",
            mt: 1,
            objectFit: "contain",
            transition: "transform 0.3s ease",
            "&:hover": { transform: "scale(1.1)" },
          }}
        />
      </Box>

      {/* Chấm tròn: không hiệu ứng, đổi màu theo scroll */}
      <Box sx={{ position: "relative" }}>
        <Box
          sx={{
            position: "absolute",
            top: `${DOT_TOP - 6}px`,
            left: "50%",
            transform: "translateX(-50%)",
            width: 12,
            height: 12,
            borderRadius: "50%",
            bgcolor: active ? ACTIVE_COLOR : "#b5b5b5",
            border: "2px solid #fff",
            boxSizing: "border-box",
            zIndex: 2,
            transition: "background-color 0.3s ease",
          }}
        />
      </Box>

      {/* Nội dung: hiện sau 0.25s */}
      <Box sx={{ ...fade(visible, 0.25) }}>
        <Typography
          sx={{
            fontSize: { xs: 20, md: 24 },
            fontWeight: 500,
            lineHeight: 1.2,
            textAlign: "left",
          }}
        >
          {head}
        </Typography>
        {body && (
          <Typography
            sx={{
              mt: 2,
              maxWidth: 480,
              fontSize: { xs: 14, md: 16 },
              fontWeight: 300,
              lineHeight: 1.5,
              textAlign: "left",
              whiteSpace: "pre-line",
            }}
          >
            {body}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

// ===== Timeline =====
const Timeline = ({ items }) => {
  const wrapRef = useRef(null);
  const [offsets, setOffsets] = useState([]);
  const [progress, setProgress] = useState(-1);

  // Khoảng cách từ tâm chấm đầu đến tâm chấm cuối
  const trackHeight = offsets.length ? offsets[offsets.length - 1] : 0;

  // Tổng chiều dài line nền: thêm EXTEND ở đầu và cuối
  const lineTop = DOT_TOP - EXTEND;
  const lineTotal = trackHeight + EXTEND * 2;

  // Line xanh: có đoạn nhô đầu khi chấm đầu sáng, có đoạn nhô cuối khi chạm chấm cuối
  const fillHeight =
    progress < 0
      ? 0
      : Math.min(progress, trackHeight) +
        EXTEND +
        (progress >= trackHeight ? EXTEND : 0);

  useEffect(() => {
    const measure = () => {
      const steps = wrapRef.current?.querySelectorAll("[data-step]");
      if (!steps || steps.length === 0) return;
      const first = steps[0].offsetTop;
      setOffsets(Array.from(steps).map((s) => s.offsetTop - first));
    };
    measure();

    const ro = new ResizeObserver(measure);
    if (wrapRef.current) ro.observe(wrapRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [items]);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      ticking = false;
      if (!wrapRef.current) return;
      const dotY = wrapRef.current.getBoundingClientRect().top + DOT_TOP;
      setProgress(window.innerHeight * 0.5 - dotY);
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
  }, []);

  return (
    <Box
      ref={wrapRef}
      sx={{ position: "relative", display: "flex", flexDirection: "column" }}
    >
      {/* Đường nền (xám) */}
      <Box
        sx={{
          position: "absolute",
          top: `${lineTop}px`,
          left: LINE_LEFT,
          transform: "translateX(-50%)",
          width: "0.25px",
          height: lineTotal,
          bgcolor: LINE_COLOR,
          zIndex: 0,
        }}
      />
      {/* Đường chạy theo scroll (xanh) */}
      <Box
        sx={{
          position: "absolute",
          top: `${lineTop}px`,
          left: LINE_LEFT,
          transform: "translateX(-50%)",
          width: "0.5px",
          height: fillHeight,
          bgcolor: ACTIVE_COLOR,
          zIndex: 1,
        }}
      />

      {items.map((item, index) => (
        <StepItem
          key={item._id ?? index}
          id={`${item._id ?? "step"}-${index}`}
          item={item}
          active={offsets.length > 0 && progress >= offsets[index]}
        />
      ))}
    </Box>
  );
};

// ===== Nav5 =====
const Nav5 = ({ header, items }) => {
  if (!header || !items || items.length === 0) return null;

  const sortedItems = [...items].sort((a, b) => {
    const yearA = parseInt(a.title) || 0;
    const yearB = parseInt(b.title) || 0;
    return yearA - yearB;
  });

  return (
    <Box sx={{ width: "100%" }}>
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
        {/* Cột trái: đứng yên, không hiệu ứng */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            textAlign: "left",
            position: { md: "sticky" },
            top: { md: 100 },
            pb: { xs: 6 },
          }}
        >
          <Typography
            component="span"
            sx={{
              alignSelf: "flex-start",
              py: 0.5,
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
              textAlign: "left",
              py: 0.5,
              fontSize: { xs: 28, md: 32 },
              letterSpacing: 0.3,
              fontWeight: 300,
            }}
          >
            {header.title_2}
          </Typography>
        </Box>

        {/* Cột phải: timeline */}
        <Timeline items={sortedItems} />
      </Box>
    </Box>
  );
};

export default Nav5;