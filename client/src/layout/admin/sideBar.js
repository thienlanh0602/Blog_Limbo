import { Box, List, ListItem, ListItemText, Button, Container, Typography } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { BoxNavButton, ButtonNav, StyleContainer } from '../../components/admin/sideBar';
import Logo from "../../assets/image_logo.svg"
import { ReactComponent as HomePageIcon } from "../../assets/nav_admin/homepage.svg"
import { ReactComponent as ResumeIcon } from "../../assets/nav_admin/resume.svg"
import { ReactComponent as MusicIcon } from "../../assets/nav_admin/music.svg"
import { ReactComponent as ColorIcon } from "../../assets/nav_admin/color.svg"
import { ReactComponent as ImageIcon } from "../../assets/nav_admin/image.svg"
import { ReactComponent as DiyIcon } from "../../assets/nav_admin/diy.svg"
import { TypographyLogo } from '../../components/header/header';



const API_URL = process.env.REACT_APP_API_URL;


const Sidebar = () => {
    const [adminName, setAdminName] = useState('')
    const links = [
        { label: 'Home page', path: '/admin', icon: HomePageIcon },
        { label: 'Resume', path: '/admin/resume', icon: ResumeIcon },
        { label: 'Music', path: '/admin/music', icon: MusicIcon },
        { label: 'Color', path: '/admin/color', icon: ColorIcon },
        { label: 'Image', path: '/admin/image', icon: ImageIcon },
        { label: 'DIY', path: '/admin/diy', icon: HomePageIcon },
    ];
    //logout tai khoan admin
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        console.log('Logout thành công ✅')
        navigate('/login')
    }

    useEffect(() => {
        // lấy tên admin 
        const fetchAdmin = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/auth/admin`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setAdminName(res.data.name)

            } catch (error) {

            }
        };

        fetchAdmin();
    }, [])

    return (

        <StyleContainer >
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                gap: 1
            }}>
                <Box component="img" src={Logo} alt="Logo" sx={{
                    height: 50, mb: 2
                }} />
                <TypographyLogo>Limbo</TypographyLogo>
            </Box>


            {/* <Box sx={{ pb: 1, fontSize: '0.9rem', color: 'gray' }}>
                Hi {adminName}
            </Box> */}

            <List sx={{my: 2}}>
                {links.map((item) => {
                    const Icon = item.icon;
                    return (
                        <ListItem
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                textDecoration: 'none',
                                px: 2,
                                my: 2.5,
                                width: '100%',
                                fontSize: 500,
                                
                                '&.active': {
                                    // bgcolor: 'rgba(0, 167, 111, 0.08)',
                                    // color: 'success.main',
                                    bgcolor: '#4efcd3',
                                    borderRadius: 0,
                                    my: 3,
                                    py: 0.8,
                                    border: '2px solid black',
                                    boxShadow: '2px 2px 0px black',
                                    // '--cls-1': '#00A76F',
                                    // '--cls-2': '#bfd7cfff',

                                },

                            }}
                            key={item.path}
                            end={item.path === '/admin' ||item.path === '/admin/'}
                            component={NavLink}
                            to={item.path}
                        >
                            {/* Icon */}
                            {Icon && <Icon style={{ width: 20, height: 20, marginRight: 8 }} />}

                            <Typography px={1} fontWeight={400}>
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


        </StyleContainer >
    );
};

export default Sidebar;