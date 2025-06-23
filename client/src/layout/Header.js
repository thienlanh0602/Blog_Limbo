import React from "react";
import { AppBar, Button, Toolbar, Box, Typography } from '@mui/material'
import { Link } from "react-router-dom";
import Logo from "../assets/image_3.png"
import { StyleAppBar } from "../components/header/header";

function Header() {

    const navBar = [
        { label: 'Resume', path: '/resume' },
        { label: 'Music', path: '/music' },
        { label: 'Color', path: '/color' },
        { label: 'Image', path: '/image' },
        { label: 'DIY', path: '/diy' },
    ];

    return (


        // Bọc header bằng appbar và tùy chỉnh
        <StyleAppBar>
            <Toolbar >
                {/* Logo */}
                <Box
                    component={Link}
                    to="/"

                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        textDecoration: 'none',
                        mr: 2, // margin phải nếu cần
                    }}
                >
                    <Box component="img" src={Logo} alt="Logo" sx={{ height: 40 }} />
                    <Typography margin={1}>Limbo</Typography>
                </Box>

                {/* Các thành phần của header */}
                <Box sx={{ flexGrow: 1 }} />
                {
                    navBar.map((item) => (
                        <Button key={item.path}
                            color="inherit"
                            sx={{ textTransform: 'none' }}
                            LinkComponent={Link}
                            to={item.path}>
                            {item.label}
                        </Button>
                    ))
                }
            </Toolbar>
        </StyleAppBar>
    );

}
export default Header;

