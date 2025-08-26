import { Box, Typography, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { StyleTypography_2 } from "../components/homepage/home";
import Icon_facebook from "../assets/footer/facebook.svg"
import Icon_github from "../assets/footer/git.svg"
import Icon_discord from "../assets/footer/discord.svg"
import Icon_insta from "../assets/footer/insta.svg"



function Footer() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Nếu chạm gần cuối trang (cách cuối 100px)
      if (scrollTop + windowHeight >= documentHeight - 100) {
        setShow(true);
      } else {
        setShow(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: show ? 20 : -100, // hiện khi xuống cuối
        left: "50%",
        transform: "translateX(-50%)",
        px: 4,
        py: 1,
        borderRadius: "50px",
        border: '1px solid black',
        // backgroundColor: "#f6f6f6",
        // boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "80%",
        maxWidth: "1000px",
        zIndex: 1200,
        transition: "all 0.3s ease",
      }}
    >
      {/* Bên trái */}
      <Typography sx={{ fontWeight: 200, fontSize: 14 }}>
        © 2025 Limbo / ThienLanh
      </Typography>

      {/* Giữa */}
      <Box sx={{ textAlign: "center" }}>
        <Typography
          variant="caption"
          sx={{ fontWeight: 400, letterSpacing: 1, fontSize: 14 }}
        >
          FIGMA &nbsp; VISUAL CODE
        </Typography>
        <br />
        <Typography
          variant="caption"
          sx={{ fontWeight: 400, letterSpacing: 1 }}
        >
          BLENDER &nbsp; ILLUSTRATOR
        </Typography>
      </Box>

      {/* Bên phải */}
      <Box sx={{display: 'flex', flexDirection: 'row', gap: 0.4}}>
        <IconButton href="https://discord.gg/QVMKmE8d" target="_blank">
          <Box sx={{height: 22}} component="img" src={Icon_discord}/>
        </IconButton>
        <IconButton href="https://github.com/thienlanh0602" target="_blank">
          <Box sx={{height: 22}} component="img" src={Icon_github}/>
        </IconButton>
        <IconButton href="https://www.facebook.com/limbo.thien.lanh/" target="_blank">
          <Box sx={{height: 22}} component="img" src={Icon_facebook}/>
        </IconButton>
        <IconButton href="https://www.instagram.com/limbo._.l/" target="_blank">
          <Box sx={{height: 22}} component="img" src={Icon_insta}/>
        </IconButton>
      </Box>
    </Box>
  );
}

export default Footer;
