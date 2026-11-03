import { Box, Typography, CardMedia } from "@mui/material";

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

const CardItem = ({ card }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: { xs: "column", sm: "row" },
      alignItems: { xs: "flex-start", sm: "center" },
      gap: 2,
      mb: 8,
    }}
  >
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
      }}
    >
      <CardMedia
        component="img"
        src={card.image}
        sx={{
          width: "40%",
          objectFit: "contain",
          transition: "transform 0.3s ease",
          "&:hover": { transform: "scale(1.1)" },
        }}
      />
      <Typography
        sx={{ fontSize: { xs: 14, md: 18 }, fontWeight: 300, textAlign: "left" }}
      >
        <HighlightText text={card.title} />
      </Typography>
    </Box>

    <Box sx={{ display: "flex", flexDirection: "column", alignSelf: "flex-start" }}>
      <Typography
        sx={{
          fontWeight: 300,
          textAlign: "left",
          fontSize: { xs: 15, md: 24 },
        }}
      >
        <HighlightText text={card.title_2} />
      </Typography>
    </Box>
  </Box>
);

const Nav4 = ({ header, cards }) => {
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
          px: { xs: 2, sm: 3, md: 10 },
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 2fr" },
          columnGap: { md: 6 },
          rowGap: { xs: 4, md: 0 },
          alignItems: "start",
        }}
      >
        {/* Cột 1 */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            position: { md: "sticky" },
            top: { md: 100 },
          }}
        >
          <Typography
            component="span"
            sx={{
              alignSelf: "flex-start",
              px: 1.25,
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
              px: 1.25,
              py: 0.5,
              borderRadius: "3px",
              fontSize: 32,
              letterSpacing: 0.3,
              fontWeight: 300,
            }}
          >
            {header.title_2}
          </Typography>
        </Box>

        {/* Cột 2 */}
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