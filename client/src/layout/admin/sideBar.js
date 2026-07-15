import { Box, Drawer, List, ListItem, Typography } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { BoxNavButton, ButtonNav, StyleContainer } from '../../components/admin/sideBar';
import { TypographyLogo } from '../../components/header/header';
import { DRAWER_WIDTH } from '../../theme/breakpoints';
import { STATIC_IMAGES } from '../../utils/Staticimages';
import { optimizeCloudinaryUrl } from '../../utils/Cloudinaryhelper';


const API_URL = process.env.REACT_APP_API_URL;

const links = [
    { label: 'Home page', path: '/admin', icon: optimizeCloudinaryUrl(STATIC_IMAGES.home, 200) },
    { label: 'Resume', path: '/admin/resume', icon: optimizeCloudinaryUrl(STATIC_IMAGES.resume, 200) },
    { label: 'Music', path: '/admin/music', icon: optimizeCloudinaryUrl(STATIC_IMAGES.music, 200) },
    { label: 'Color', path: '/admin/color', icon: optimizeCloudinaryUrl(STATIC_IMAGES.color, 200) },
    { label: 'Image', path: '/admin/image', icon: optimizeCloudinaryUrl(STATIC_IMAGES.image, 200) },
    { label: 'DIY', path: '/admin/diy', icon: optimizeCloudinaryUrl(STATIC_IMAGES.diy, 200) },
];

const SidebarContent = ({ onNavigate }) => {
    const [adminName, setAdminName] = useState('')

    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login')
    }

    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/auth/admin`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setAdminName(res.data.name)
            } catch (error) {
                // silent
            }
        };

        fetchAdmin();
    }, [])

    return (
        <>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                gap: 1
            }}>
                <Box component="img" src={optimizeCloudinaryUrl(STATIC_IMAGES.logo_intro, 1200)} alt="Logo" sx={{
                    height: { xs: 40, md: 50 }, mb: 2, transform: 'scaleX(-1)'
                }} />
                <TypographyLogo>Limbo</TypographyLogo>
            </Box>

            <List sx={{ my: 2 }}>
                {links.map((item) => {
                    return (
                        <ListItem
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                textDecoration: 'none',
                                px: { xs: 1, md: 2 },
                                my: { xs: 1.5, md: 2.5 },
                                width: '100%',
                                fontSize: 500,

                                '&.active': {
                                    bgcolor: '#4efcd3',
                                    borderRadius: 0,
                                    my: 3,
                                    py: 0.8,
                                    border: '2px solid black',
                                    boxShadow: '2px 2px 0px black',
                                },

                            }}
                            key={item.path}
                            end={item.path === '/admin' || item.path === '/admin/'}
                            component={NavLink}
                            to={item.path}
                            onClick={onNavigate}
                        >
                            {item.icon && (
                                <Box
                                    component="img"
                                    src={item.icon}
                                    alt={item.label}
                                    sx={{ width: 20, height: 20, marginRight: 1, flexShrink: 0 }}
                                />
                            )}

                            <Typography px={1} fontWeight={400} sx={{ fontSize: { xs: 14, md: 16, color: 'black' } }}>
                                {item.label}
                            </Typography>
                        </ListItem>
                    );
                })}
            </List>
            <BoxNavButton>
                <ButtonNav onClick={handleLogout}>
                    Logout
                </ButtonNav>
            </BoxNavButton>
        </>
    );
};

const Sidebar = ({ isMobile, mobileOpen, onMobileClose }) => {
    if (isMobile) {
        return (
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={onMobileClose}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        width: DRAWER_WIDTH,
                        boxSizing: 'border-box',
                        borderRight: '2px solid black',
                    },
                }}
            >
                <StyleContainer isMobile>
                    <SidebarContent onNavigate={onMobileClose} />
                </StyleContainer>
            </Drawer>
        );
    }

    return (
        <StyleContainer>
            <SidebarContent />
        </StyleContainer>
    );
};

export default Sidebar;