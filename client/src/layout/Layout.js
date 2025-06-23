import {  Box } from '@mui/material'
import {  Outlet } from "react-router-dom";
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

