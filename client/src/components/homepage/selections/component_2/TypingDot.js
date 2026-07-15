// TypingDots.jsx
import { Box } from "@mui/material";

const DOT_COUNT = [0, 1, 2];

const TypingDots = ({ color = "#555", size = { xs: 4, sm: 6, md: 8 }, speed = 1.2 }) => {
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: "6px", px: 1, py: 0 }}>
            {DOT_COUNT.map((i) => (
                <Box
                    key={i}
                    sx={{
                        width: size,
                        height: size,
                        borderRadius: "50%",
                        backgroundColor: color,
                        animation: `typing-bounce ${speed}s ease-in-out infinite`,
                        animationDelay: `${i * 0.2}s`,
                        "@keyframes typing-bounce": {
                            "0%, 60%, 100%": { transform: "translateY(0)", opacity: 0.4 },
                            "30%": { transform: "translateY(-8px)", opacity: 1 },
                        },
                    }}
                />
            ))}
        </Box>
    );
};

export default TypingDots;