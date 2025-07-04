import React, { useState } from "react";
import { Container, Typography, TextField, Button } from "@mui/material";
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
const API_URL = process.env.REACT_APP_API_URL;


function loginPage() {

    const [formData, setFormData] = useState({ username: '', password: '' })
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/api/auth/login`, formData,
                { headers: { 'Content-Type': 'application/json' } });
            console.log("Đăng nhập thành công ✅");
            localStorage.setItem('token', response.data.token);
            navigate('/admin');
        }

        catch (err) {
            setError('Sai tài khoản hoặc mật khẩu!!');
        }
    };

    return (
        <Container maxWidth="xs">
            <Typography variant="h4" gutterBottom>Admin Login</Typography>
            {error && <Typography color="error">{error}</Typography>}
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    margin="normal"
                    required
                />
                <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    margin="normal"
                    required
                />
                <Button type="submit" variant="contained" fullWidth sx={{
                    backgroundColor: '#4efcd3',
                    border: '2px solid black',
                    borderRadius: 10,
                    minWidth: 100,
                    minHeight: 50,
                    color: 'black',
                }}>Đăng nhập</Button>
            </form>
        </Container>


    );
}

export default loginPage;