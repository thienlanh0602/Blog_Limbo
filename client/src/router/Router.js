import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from '../pages/homepage/Home';

import Color from '../pages/color/Color';
import DIY from '../pages/diy/DIY';
import Image from '../pages/imagePage/Image';
import Music from '../pages/music/Music';
import Resume from '../pages/resume/Resume';

import AdminLayout from '../layout/admin/adminLayout';
import HomepageAdmin from '../pages/admin/homepageAdmin/HomepageAdmin';
import ResumeAdmin from '../pages/admin/resumeAdmin/ResumeAdmin';
import ColorAdmin from '../pages/admin/colorAdmin/ColorAdmin';
import MusicAdmin from '../pages/admin/musicAdmin/MusicAdmin';
import DIYAdmin from '../pages/admin/diyAdmin/DIY_Admin';
import ImageAdmin from '../pages/admin/imageAdmin/ImageAdmin';

import '../router/App.css';
import Layout from '../layout/Layout';
import LoginPage from '../pages/admin/loginAdmin/loginPage';
import ProtectedRoute from '../router/ProtectedRoute/protectedAdmin';
import PublicRoute from '../router/ProtectedRoute/publicAdmin';

function Routers() {
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

export default Routers;
