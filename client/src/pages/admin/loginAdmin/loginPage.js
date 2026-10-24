import React, { useState } from "react";
import {
    Box,
    Stack,
    Container,
    Typography,
    TextField,
    InputAdornment,
    IconButton,
    Button,
    Alert,
    Fade,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

// ==========================================
// Icon SVG thuần (không phụ thuộc @mui/icons-material)
// ==========================================
const IconEye = (props) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...props}>
        <path
            d="M1.5 12C1.5 12 5 5 12 5C19 5 22.5 12 22.5 12C22.5 12 19 19 12 19C5 19 1.5 12 1.5 12Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
);

const IconEyeOff = (props) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...props}>
        <path d="M3 3L21 21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path
            d="M10.6 5.14C11.06 5.05 11.53 5 12 5C19 5 22.5 12 22.5 12C22.19 12.6 21.47 13.78 20.3 15"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M6.9 6.9C3.8 8.85 1.5 12 1.5 12C1.5 12 5 19 12 19C13.63 19 15.06 18.62 16.28 18.02"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M9.9 9.9C9.34 10.46 9 11.19 9 12C9 13.66 10.34 15 12 15C12.81 15 13.54 14.66 14.1 14.1"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const IconUser = (props) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...props}>
        <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" />
        <path
            d="M4.5 20C5.5 16.5 8.4 14.5 12 14.5C15.6 14.5 18.5 16.5 19.5 20"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const IconLock = (props) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...props}>
        <rect x="4.5" y="10.5" width="15" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path
            d="M8 10.5V7.5C8 5.29 9.79 3.5 12 3.5C14.21 3.5 16 5.29 16 7.5V10.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
        />
        <circle cx="12" cy="15.25" r="1.4" fill="currentColor" />
    </svg>
);

function LoginPage() {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.username || !formData.password) {
            setError("Vui lòng nhập đầy đủ tài khoản và mật khẩu.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                `${API_URL}/api/auth/login`,
                formData,
                { headers: { "Content-Type": "application/json" } }
            );
            console.log("Đăng nhập thành công ✅");
            localStorage.setItem("token", response.data.token);
            navigate("/admin");
        } catch (err) {
            setError("Sai tài khoản hoặc mật khẩu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#FAFAF9" }}>
            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    px: 3,
                }}
            >
                <Container maxWidth="xs" disableGutters>
                    <Stack spacing={0.75} sx={{ mb: 5, textAlign: "center", alignItems: "center" }} >
                        <Typography
                            sx={{
                                fontSize: "1.85rem",
                                fontWeight: 600,
                                color: "#1A1A1A",
                            }}
                        >
                            Đăng nhập quản trị
                        </Typography>
                        <Typography sx={{ color: "#6B6B6B", fontSize: "0.925rem" }}>
                            Nhập thông tin tài khoản để truy cập trang quản trị.
                        </Typography>
                    </Stack>

                    <Fade in={!!error}>
                        <Box sx={{ mb: error ? 2.5 : 0 }}>
                            {error && (
                                <Alert severity="error" variant="outlined" sx={{ borderRadius: 1.5 }}>
                                    {error}
                                </Alert>
                            )}
                        </Box>
                    </Fade>

                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <Stack spacing={2.5}>
                            <TextField
                                name="username"
                                label="Tài khoản"
                                placeholder="Nhập tên đăng nhập"
                                value={formData.username}
                                onChange={handleChange}
                                fullWidth
                                autoComplete="username"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <IconUser style={{ color: "#9E9E9E" }} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                            />

                            <TextField
                                name="password"
                                label="Mật khẩu"
                                placeholder="Nhập mật khẩu"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={handleChange}
                                fullWidth
                                autoComplete="current-password"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <IconLock style={{ color: "#9E9E9E" }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword((s) => !s)}
                                                edge="end"
                                                size="small"
                                                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                                            >
                                                {showPassword ? (
                                                    <IconEyeOff style={{ color: "#6B6B6B" }} />
                                                ) : (
                                                    <IconEye style={{ color: "#6B6B6B" }} />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                size="large"
                                disabled={loading}
                                sx={{
                                    mt: 1,
                                    py: 1.25,
                                    borderRadius: 1.5,
                                    textTransform: "none",
                                    fontSize: "0.95rem",
                                    fontWeight: 600,
                                    bgcolor: "#17171B",
                                    color: "#FAFAF9",
                                    "&:hover": { bgcolor: "#2B2B32" },
                                    "&.Mui-disabled": { bgcolor: "#C9C9C9", color: "#FAFAF9" },
                                }}
                            >
                                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                            </Button>
                        </Stack>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
}

export default LoginPage;