import { Box, List, ListItem, ListItemText, Button, Container, Typography } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { StyleContainer } from '../../components/admin/sideBar';
import Logo from "../../assets/image_logo.svg"
import { ReactComponent as HomePageIcon } from "../../assets/nav_admin/homepage.svg"
import { ReactComponent as ResumeIcon } from "../../assets/nav_admin/resume.svg"
import { ReactComponent as MusicIcon } from "../../assets/nav_admin/music.svg"
import { ReactComponent as ColorIcon } from "../../assets/nav_admin/color.svg"
import { ReactComponent as ImageIcon } from "../../assets/nav_admin/image.svg"
import { ReactComponent as DiyIcon } from "../../assets/nav_admin/diy.svg"



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
            <Box component="img" src={Logo} alt="Logo" sx={{ height: 40 }} />
            {/* <Box sx={{ pb: 1, fontSize: '0.9rem', color: 'gray' }}>
                Hi {adminName}
            </Box> */}

            <List>
                {links.map((item) => {
                    const Icon = item.icon;
                    return (
                        <ListItem
                            sx={{ px: 0, py: 1.5}}
                            key={item.path}
                            component={NavLink}
                            to={item.path}
                        >
                            {/* Icon */}
                            {Icon && <Icon style={{ width: 20, height: 20, marginRight: 8 }} />}

                            <Typography px={1} fontWeight={400} fontSize={14}>
                                {item.label}
                            </Typography>
                        </ListItem>
                    );
                })}
            </List>

            <Button sx={{}} onClick={handleLogout}>
                Logout
            </Button>



        </StyleContainer>
    );
};

export default Sidebar;