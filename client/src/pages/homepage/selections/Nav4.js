import { Box, Typography, CardMedia } from "@mui/material";
import { commonSxDisplay, StyleTypography_Text, StyleTypography_Title } from "../../../components/homepage/home";

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

const CardItem = ({ card, idx }) => (

  <Box
    sx={{
      width: { xs: "100%", sm: 280, md: 300 },
      maxWidth: 300,
      bgcolor: "white",
      mx: { xs: "auto", sm: 0 },
      alignSelf: "stretch",
      boxShadow: "3px 3px 0px black",
      border: "1px solid black",
      p: { xs: 1.5, md: 2 },
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      textAlign: "center",
      gap: 2,
      boxSizing: 'border-box',
    }}
  >
    <Box
      sx={{
        width: "100%",
        height: { xs: 220, sm: 260, md: 300 },
        display: "flex",
        alignItems: "center",
        position: 'relative',
        background: idx === 0 ? "#6D6D6D" : "#29F0C4",
        justifyContent: "center",
        borderRadius: "60px 0 60px 0",
        overflow: "hidden",
        ...(idx === 0 && {
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0.5,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            opacity: 0.7,
            mixBlendMode: "overlay",
            pointerEvents: "none",
            zIndex: 2
          },
        }),
      }}
    >
      <CardMedia
        component="img"
        src={card.image}
        sx={{
          position: "relative",
          zIndex: 1,
          width: { xs: '35%', sm: '46%', md: '50%' },
          objectFit: "contain",
          transition: "transform 0.3s ease",
          "&:hover": {
            transform: "scale(1.1)",
          },
        }}
      />
    </Box>

    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        textAlign: "center",
        flex: 1,
        gap: 2,
        mx: { xs: 1, md: 2 },
      }}
    >
      <Typography fontWeight="bold" textTransform="uppercase" sx={{ fontSize: { xs: 14, md: 16 } }}>
        {card.title}
      </Typography>
      <Typography sx={{ fontWeight: 200, textAlign: "left", fontSize: { xs: 13, md: 14 } }}>
        <HighlightText text={card.title_2} />
      </Typography>
    </Box>
  </Box>
);

const Nav4 = ({ header, cards }) => {
  if (!header) return null;

  return (
    <Box
      sx={{
        ...commonSxDisplay,
        flexDirection: "column",
        gap: { xs: 6, md: 10 },
        width: '100%',

      }}
    >
      <Box sx={{
        ...commonSxDisplay,
        flexDirection: 'column',
      }}>
        <StyleTypography_Title>
          {header.title}
        </StyleTypography_Title>

        <StyleTypography_Text>
          {header.title_2}
        </StyleTypography_Text>
      </Box>

      <Box
        display="flex"
        justifyContent="center"
        gap={{ xs: 3, sm: 6, md: 20 }}
        flexWrap="wrap"
        flexDirection={{ xs: "column", sm: "row" }}
        width="100%"
        alignItems={{ xs: "center", sm: "stretch" }}
        mx="auto"
      >
        {cards.map((card, idx) => (
          <CardItem
            key={card._id}
            card={card}
            idx={idx}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Nav4;
