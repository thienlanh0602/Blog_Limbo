import { Box, Typography, IconButton } from "@mui/material";
import { useEffect, useState } from "react";

import Icon_facebook from "../assets/footer/facebook.svg";
import Icon_github from "../assets/footer/git.svg";
import Icon_discord from "../assets/footer/discord.svg";
import Icon_insta from "../assets/footer/insta.svg";

const socialLinks = [
  { href: "https://discord.gg/QVMKmE8d", icon: Icon_discord },
  { href: "https://github.com/thienlanh0602", icon: Icon_github },
  { href: "https://www.facebook.com/limbo.thien.lanh/", icon: Icon_facebook },
  { href: "https://www.instagram.com/limbo._.l/", icon: Icon_insta },
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
        bottom: show ? 20 : -100,
        left: "50%",
        transform: "translateX(-50%)",
        px: 4,
        py: 1,
        borderRadius: "50px",
        border: "1px solid black",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "80%",
        maxWidth: 1000,
        zIndex: 1200,
        transition: "all 0.3s ease",
      }}
    >
      {/* Trái */}
      <Typography sx={{ fontWeight: 200, fontSize: 12, }}>
        © 2025 Limbo / ThienLanh
      </Typography>

      {/* Giữa */}
      <Box textAlign="center">
        <Typography variant="caption" sx={{ fontWeight: 400, letterSpacing: 1, fontSize: 13 }}>
          FIGMA &nbsp; VISUALCODE
        </Typography>
        <Typography variant="caption" sx={{ fontWeight: 400, letterSpacing: 1, fontSize: 13 }}>
          &nbsp; BLENDER &nbsp; ILLUSTRATOR
        </Typography>
      </Box>

      {/* Phải */}
      <Box sx={{ display: "flex", gap: 0.4 }}>
        {socialLinks.map((link, idx) => (
          <IconButton key={idx} href={link.href} target="_blank">
            <Box component="img" src={link.icon} sx={{ height: 22 }} />
          </IconButton>
        ))}
      </Box>
    </Box>
  );
}

export default Footer;
