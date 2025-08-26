import React, { useState } from "react";
import { Container, Typography, TextField, Button } from "@mui/material";
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { StyleButtonLogin, TextFieldLogin, TextFieldLoginPw, TextFieldLoginUser } from "../../../components/admin/login";
import { StyleTyp } from "../../../components/admin/login";
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
        <Container maxWidth="xs" sx={{mt: 5}}>
            <StyleTyp>
                Admin Login
            </StyleTyp>
            {error && <Typography color="error">{error}</Typography>}
            <form  onSubmit={handleSubmit}>
                <TextFieldLoginUser
                    value={formData.username}
                    onChange={handleChange}
                />

                <TextFieldLoginPw
                    value={formData.password}
                    onChange={handleChange}
                />

                <StyleButtonLogin type="submit" fullWidth>Đăng nhập</StyleButtonLogin>
            </form>
        </Container>
    );
}

export default loginPage;