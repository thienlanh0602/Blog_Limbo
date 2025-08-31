import { Box, Typography, CardMedia } from "@mui/material";
import { StyleTypography_2 } from "../../../components/homepage/home";

// ===================== Helpers =====================
const renderWithHighlight = (text) => {
  if (!text.includes("Ân")) return text;
  const [before, after] = text.split("Ân");
  return (
    <>
      {before} <br /> {"Ân" + after}
    </>
  );
};

// ===================== Card Item =====================
const CardItem = ({ card, idx }) => (
  <Box
    sx={{
      width: 300,
      bgcolor: "white",
      boxShadow: "3px 3px 0px black",
      border: "1px solid black",
      p: 2,
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      textAlign: "center",
      gap: 2,
    }}
  >
    {/* Hình ảnh */}
    <Box
      sx={{
        height: 300,
        background:
          idx === 0
            ? "linear-gradient(180deg, #CECECE, #6D6D6D)"
            : "linear-gradient(180deg, #F9E2FD, #29F0C4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CardMedia
        component="img"
        src={`http://localhost:5000${card.image}`}
        sx={{ width: "50%", objectFit: "contain" }}
      />
    </Box>

    {/* Text */}
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        textAlign: "center",
        gap: 2,
        mx: 2,
      }}
    >
      <Typography fontWeight="bold" textTransform="uppercase">
        {card.title}
      </Typography>
      <Typography sx={{ fontWeight: 200, textAlign: "left" }}>
        {renderWithHighlight(card.title_2)}
      </Typography>
    </Box>
  </Box>
);

// ===================== Main Component =====================
const Nav4 = ({ items }) => {
  if (!items || items.length === 0) return null;

  const header = items[0];
  const cards = items.slice(1);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 10,
      }}
    >
      {/* Title section */}
      <Box>
        <Typography fontWeight={800} fontSize={34} textTransform="uppercase">
          {header.title}
        </Typography>
        <StyleTypography_2>{header.title_2}</StyleTypography_2>
      </Box>

      {/* Cards section */}
      <Box display="flex" justifyContent="center" gap={20} flexWrap="wrap">
        {cards.map((card, idx) => (
          <CardItem key={idx} card={card} idx={idx} />
        ))}
      </Box>
    </Box>
  );
};

export default Nav4;
