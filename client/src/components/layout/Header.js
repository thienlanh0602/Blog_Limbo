import React from "react";
import { AppBar, Button, Toolbar, Box } from '@mui/material'
import { Link } from "react-router-dom";
import Logo from "../../assets/image_3.png"

function Header() {

    const navBar = [
        { label: 'Resume', path: '/resume' },
        { label: 'Music', path: '/music' },
        { label: 'Color', path: '/color' },
        { label: 'Image', path: '/image' },
        { label: 'DIY', path: '/diy' },
    ]
    return (


        // Bọc header bằng appbar và tùy chỉnh
        <AppBar position="static"
            elevation={0}
            sx={{
                backgroundColor: 'transparent',
                borderBottom: '1px solid #e0e0e0', // màu xám nhẹ như gạch
                boxShadow: 'none',
                color: '#000',
            }}>
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
                </Box>

                {/* Các thành phần của header */}
                <Box sx={{ flexGrow: 1 }} />
                {
                    navBar.map((item) => (
                        <Button key={item.path}
                            color="inherit"
                            LinkComponent={Link}
                            to={item.path}>
                            {item.label}
                        </Button>
                    ))
                }
            </Toolbar>
        </AppBar>
    );

}
export default Header;

