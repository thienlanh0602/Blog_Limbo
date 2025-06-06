import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';

import Color from './pages/Color';
import DIY from './pages/DIY';
import Image from './pages/Image';
import Music from './pages/Music';
import Resume from './pages/Resume';

import AdminLayout from './components/layout/admin/adminLayout';
import HomepageAdmin from './components/admin/HomepageAdmin';
import ResumeAdmin from './components/admin/ResumeAdmin';
import ColorAdmin from './components/admin/ColorAdmin';
import MusicAdmin from './components/admin/MusicAdmin';
import DIYAdmin from './components/admin/DIY_Admin';
import ImageAdmin from './components/admin/ImageAdmin';



import './App.css';
import Layout from './components/layout/Layout';
import LoginPage from './components/admin/loginPage';
import ProtectedRoute from './components/protectedRouter/protectedAdmin';
import PublicRoute from './components/protectedRouter/publicAdmin';

function App() {
  return (
    <Router>

      <Routes >
        {/* path này của trang chủ */}
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='resume' element={< Resume />} />
          <Route path='image' element={< Image />} />
          <Route path='music' element={<Music />} />
          <Route path='color' element={<Color />} />
          <Route path='diy' element={<DIY />} />
        </Route>

        {/* path này của sidebar admin */}
        <Route path='/admin' element={< AdminLayout />} >
          <Route index element={
            <ProtectedRoute>
              <HomepageAdmin />
            </ProtectedRoute>
          } />
          <Route path='resume' element={< ResumeAdmin />} />
          <Route path='music' element={< MusicAdmin />} />
          <Route path='color' element={< ColorAdmin />} />
          <Route path='image' element={< ImageAdmin />} />
          <Route path='diy' element={< DIYAdmin />} />

        </Route>

        {/* này của login admin */}
        <Route path='/login' element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } />


      </Routes>

    </Router>
  );
}

export default App;
