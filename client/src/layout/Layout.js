import React from "react";
import { AppBar, Button, Toolbar, Typography, Box } from '@mui/material'
import { Link, Outlet } from "react-router-dom";
import Header from "./Header";


function Layout() {

    return (

        <>
            <Header />

            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                textAlign: 'center',
                px: 2,
            }} >
                <Outlet />
            </Box>

        </>

    );

}
export default Layout;

