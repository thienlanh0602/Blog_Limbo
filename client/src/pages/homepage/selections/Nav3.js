import { useEffect, useRef, useState } from "react";
import { Box, Typography } from "@mui/material";
import { commonSxDisplay } from "../../../components/homepage/home";
import { optimizeCloudinaryUrl } from "../../../utils/Cloudinaryhelper";
import { STATIC_IMAGES } from "../../../utils/Staticimages";

// Tách title thành 2 nửa: nếu có dấu "|" thì tách ở đó, không thì tách đôi ở giữa
const splitTitle = (title = "") => {
  if (title.includes("|")) {
    const [a, ...b] = title.split("|");
    return [a.trim(), b.join("|").trim()];
  }
  const mid = Math.ceil(title.length / 2);
  return [title.slice(0, mid), title.slice(mid)];
};

const Nav3 = ({ item }) => {
  const wrapRef = useRef(null);
  const [active, setActive] = useState(0);
  const [mode, setMode] = useState("before"); // before | pinned | after

  const images = Array.isArray(item?.image) ? item.image : [];
  const count = images.length;

  useEffect(() => {
    if (count === 0) return;
    let ticking = false;

    const update = () => {
      ticking = false;
      if (!wrapRef.current) return;
      const top = wrapRef.current.getBoundingClientRect().top;
      const total = wrapRef.current.offsetHeight - window.innerHeight; // quãng cuộn khi bị ghim

      if (top > 0) {
        setMode("before");
        setActive(0);
      } else if (-top < total) {
        setMode("pinned");
        const p = Math.min(Math.max(-top / total, 0), 1);
        setActive(Math.min(Math.floor(p * count), count - 1));
      } else {
        setMode("after");
        setActive(count - 1);
      }
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
  }, [count]);

  if (!item) return null;

  const [titleLeft, titleRight] = splitTitle(item.title);

  const pinStyle =
    mode === "pinned"
      ? { position: "fixed", top: 0, left: 0 }
      : mode === "after"
        ? { position: "absolute", bottom: 0, left: 0 }
        : { position: "absolute", top: 0, left: 0 };

  return (
    // Vùng cuộn: mỗi ảnh ứng với 100vh cuộn
    <Box
      ref={wrapRef}
      sx={{
        position: "relative",
        width: "100%",
        height: `${Math.max(count, 1) * 100}vh`,
      }}
    >
      {/* Khung ghim */}
      <Box
        sx={{
          ...commonSxDisplay,
          ...pinStyle,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100vh",
          minHeight: 600,
          px: { xs: 2, sm: 3, md: 0 },
          boxSizing: "border-box",
          overflow: "hidden",

          // backgroundImage: `url(${optimizeCloudinaryUrl(STATIC_IMAGES.bg_nav_3, 3000)})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Title lớn: chữ trái - ảnh - chữ phải */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.08em",
            fontSize: "clamp(48px, 13vw, 170px)", // ảnh bên dưới tính theo em nên co giãn theo chữ
            fontWeight: 500,
            lineHeight: 1,
            letterSpacing: "-0.04em",
            whiteSpace: "nowrap",
          }}
        >
          <span>{titleLeft}</span>

          {count > 0 && (
            <Box
              sx={{
                position: "relative",
                height: { xs: 100, md: 200 }, // xs nhỏ lại, md giữ 200
                aspectRatio: "1 / 1",         // vẫn là ô vuông, chiều rộng tự theo chiều cao
                borderRadius: "6px",
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              {images.map((img, index) => (
                <Box
                  key={img}
                  component="img"
                  src={optimizeCloudinaryUrl(img, 800)}
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    opacity: index === active ? 1 : 0,
                    transition: "opacity 0.5s ease",
                  }}
                />
              ))}
            </Box>
          )}
          <span>{titleRight}</span>
        </Box>

        {/* Dòng mô tả bên dưới */}
        {item.title_2 && (
          <Typography
            sx={{
              mt: { xs: 3, md: 6 },
              maxWidth: { xs: 280, sm: 520, md: 860 },
              textAlign: "center",
              fontSize: { xs: 24, sm: 28, md: 44 },
              fontWeight: 400,
              lineHeight: 1.2,
              whiteSpace: "pre-line",
            }}
          >
            {item.title_2}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Nav3;