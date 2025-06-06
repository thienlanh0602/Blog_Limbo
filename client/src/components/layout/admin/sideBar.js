import { Box, List, ListItem, ListItemText, Button } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';


const API_URL = process.env.REACT_APP_API_URL;


const Sidebar = () => {
    const [adminName, setAdminName] = useState('')
    const links = [
        { label: 'HOMEPAGE', path: '/admin' },
        { label: 'RESUME', path: '/admin/resume' },
        { label: 'MUSIC', path: '/admin/music' },
        { label: 'COLOR', path: '/admin/color' },
        { label: 'IMAGE', path: '/admin/image' },
        { label: 'DIY', path: '/admin/diy' },
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

        <Box
            sx={{
                width: 240,           // Chiều rộng sidebar phải trùng với drawerWidth
                height: '100vh',
                bgcolor: '#f5f5f5',
                p: 2,
                position: 'fixed',
                top: 0,
                left: 0,
            }}
        >
            <List>
                {links.map((item) => (
                    <ListItem key={item.path} component={NavLink} to={item.path} >
                        <ListItemText primary={item.label} />
                    </ListItem>
                ))}
            </List>

            {/* Dòng chào admin */}
            <Box sx={{ flexGrow: 1 }} />

            {/* Dòng chào admin sát lề dưới */}
            <Box sx={{ pb: 1, textAlign: 'center', fontSize: '0.9rem', color: 'gray' }}>
                Hi {adminName}
            </Box>

            <Button onClick={handleLogout}>
                Logout
            </Button>



        </Box>
    );
};

export default Sidebar;