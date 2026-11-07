import { useState, useEffect } from "react";
import { Typography } from "@mui/material";

const DEFAULT_EMOJIS = ["😎", "🤗", "🤪", "😍", "🤫", "😜", "🔥", "😝", "😉", "🎃", "😁"];

export const Context = ({
    children,
    bp,
    sx = {},
    emojis = DEFAULT_EMOJIS,
    interval = 2000, // 3 giây đổi 1 lần
    ...props
}) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (!emojis.length) return;
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % emojis.length);
        }, interval);
        return () => clearInterval(timer); // dọn dẹp khi component bị gỡ
    }, [emojis, interval]);

    return (
        <Typography
            gutterBottom={false}
            fontWeight={500}
            sx={{
                fontSize: { xs: 24, md: 32 },
                position: "relative",
                maxWidth: { xs: 280, sm: 320, md: 'none' },
                whiteSpace: 'normal',
                px: { xs: 2, md: 0 },
                pt: { xs: 1, md: 2 },
                zIndex: 1,
                ...sx,
            }}
            {...props} >

            {children}
            {emojis.length > 0 && (
                <span aria-hidden="true" style={{ marginLeft: 8 }}>
                    {emojis[index]}
                </span>
            )}
        </Typography>
    )
}