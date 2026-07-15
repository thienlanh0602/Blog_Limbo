import { Box, Typography, IconButton } from "@mui/material";
import { useEffect, useState } from "react";

import { STATIC_IMAGES } from '../utils/Staticimages';
import { optimizeCloudinaryUrl } from '../utils/Cloudinaryhelper';

const socialLinks = [
  { href: "https://discord.gg/QVMKmE8d", icon: optimizeCloudinaryUrl(STATIC_IMAGES.discord, 200) },
  { href: "https://github.com/thienlanh0602", icon: optimizeCloudinaryUrl(STATIC_IMAGES.github, 200) },
  { href: "https://www.facebook.com/limbo.thien.lanh/", icon:optimizeCloudinaryUrl(STATIC_IMAGES.facebook, 200) },
  { href: "https://www.instagram.com/limbo._.l/", icon: optimizeCloudinaryUrl(STATIC_IMAGES.insta, 200) },
];

function Footer() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollY } = window;
      const { innerHeight } = window;
      const { scrollHeight } = document.documentElement;

      setShow(scrollY + innerHeight >= scrollHeight - 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  return (
    <Box
      sx={{
        position: "fixed",
        bottom: show ? { xs: 12, md: 20 } : -120,
        left: "50%",
        transform: "translateX(-50%)",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 1.5, md: 1 },
        borderRadius: { xs: "30px", md: "50px" },
        border: "1px solid black",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
        justifyContent: { xs: "center", md: "space-between" },
        gap: { xs: 1, md: 0 },
        width: { xs: "70%", sm: "85%", md: "80%" },
        maxWidth: 1000,
        zIndex: 1200,
        transition: "all 0.3s ease",
        backgroundColor: "white",
      }}
    >
      <Typography sx={{ fontWeight: 200, fontSize: { xs: 10, sm: 12 }, order: { xs: 2, md: 0 } }}>
        © 2025 Limbo / ThienLanh
      </Typography>

      <Box
        textAlign="center"
        sx={{
          display: { xs: "none", sm: "block" },
          order: { xs: 0, md: 1 },
        }}
      >
        <Typography variant="caption" sx={{ fontWeight: 400, letterSpacing: 1, fontSize: { xs: 10, md: 13 } }}>
          FIGMA &nbsp; VISUALCODE
        </Typography>
        <Typography variant="caption" sx={{ fontWeight: 400, letterSpacing: 1, fontSize: { xs: 10, md: 13 }, display: { xs: "block", md: "inline" } }}>
          &nbsp; BLENDER &nbsp; ILLUSTRATOR
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 0.4, order: { xs: 1, md: 2 } }}>
        {socialLinks.map((link) => (
          <IconButton key={link.href} href={link.href} target="_blank" sx={{ p: { xs: 0.5, md: 1 } }}>
            <Box component="img" src={link.icon} sx={{ height: { xs: 18, md: 22 } }} />
          </IconButton>
        ))}
      </Box>
    </Box>
  );
}

export default Footer;
