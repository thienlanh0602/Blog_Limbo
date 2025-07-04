import { Box, IconButton, useMediaQuery, useTheme, Drawer, List, ListItem, ListItemText, Container } from '@mui/material'
import { Link } from "react-router-dom";
import Logo from "../assets/image_logo.svg"
import Arrow from "../assets/Arrow_1.svg"
import Menu from "../assets/menu.svg"

import { BoxImage, BoxLogo, BoxNav, ButtonImage, ButtonNav, EditDrawer, StyleAppBar, StyleContainer, StyleToolbar, TypographyLogo } from "../components/header/header";
import { useState } from 'react';

function Header() {

    const navBar = [
        { label: 'Resume', path: '/resume' },
        { label: 'Music', path: '/music' },
        { label: 'Color', path: '/color' },
        { label: 'Image', path: '/image' },
        { label: 'DIY', path: '/diy' },
    ];
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    const [open, setOpen] = useState(false);

    return (
        <StyleAppBar>
            <StyleToolbar >
                <StyleContainer>
                    {/* Logo */}
                    <BoxLogo component={Link} to="/">
                        <Box component="img" src={Logo} alt="Logo" sx={{ height: 40 }} />
                        <TypographyLogo >Limbo</TypographyLogo>
                    </BoxLogo>

                    {/* Các thành phần của header */}
                    {isMobile ? (
                        <>
                            <ButtonImage onClick={() => setOpen(true)}>
                                <BoxImage component='img' src={Menu} />
                            </ButtonImage>

                            <EditDrawer open={open} onClose={() => setOpen(false)}>
                                {navBar.map((item) => (
                                    <ButtonNav
                                        onClick={() => setOpen(false)}
                                        key={item.path}
                                        LinkComponent={Link}
                                        to={item.path}
                                    >
                                        {item.label}
                                    </ButtonNav>
                                ))}
                                    <ButtonImage>
                                        <BoxImage component='img' src={Arrow} />
                                    </ButtonImage>
                                
                            </EditDrawer>
                        </>
                    ) : (
                        <>
                            <BoxNav>
                                {navBar.map((item) => (
                                    <ButtonNav
                                        key={item.path}
                                        LinkComponent={Link}
                                        to={item.path}
                                    >
                                        {item.label}
                                    </ButtonNav>
                                ))}

                            </BoxNav>
                            <Box>
                                <ButtonImage>
                                    <BoxImage component='img' src={Arrow} />
                                </ButtonImage>
                            </Box>
                        </>
                    )}

                </StyleContainer>
            </StyleToolbar>
        </StyleAppBar>
    );

}
export default Header;

