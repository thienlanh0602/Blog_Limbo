import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

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
import IntroScreen from '../utils/IntroScreen';

const INTRO_ROUTES = {
  '/': 'Hey',
  '/music': 'Music',
  '/image': 'Image',
};

// Kiểm tra xem lần load trang hiện tại có phải do người dùng nhấn F5 / reload không
// (khác với việc mở tab mới, gõ URL, hoặc chuyển route bằng React Router - những
// trường hợp đó không làm document load lại nên hàm này sẽ không được gọi lại)
function isPageReload() {
  try {
    const navEntries = performance.getEntriesByType('navigation');
    if (navEntries && navEntries.length > 0) {
      return navEntries[0].type === 'reload';
    }
    // Fallback cho trình duyệt cũ không hỗ trợ Navigation Timing Level 2
    if (performance.navigation) {
      return performance.navigation.type === 1; // 1 = TYPE_RELOAD
    }
  } catch (e) {
    // ignore
  }
  return false;
}

function IntroManager() {
  const location = useLocation();
  const [introText, setIntroText] = useState(null);
  const prevPathRef = useRef(null);

  useEffect(() => {
    const currentPath = location.pathname;
    const matchedText = INTRO_ROUTES[currentPath];

    // isInitialMount = true nghĩa là đây là lần render đầu tiên của App
    // (tức là vừa có một lần LOAD TRANG THẬT SỰ - có thể là mở mới hoặc F5)
    const isInitialMount = prevPathRef.current === null;

    const shouldSkip = sessionStorage.getItem('skipIntro') === '1';
    if (shouldSkip) {
      sessionStorage.removeItem('skipIntro');
    }

    // Chỉ bỏ qua intro khi: đây là lần mount đầu tiên VÀ nguyên nhân load trang là do F5/reload
    const isReloadSkip = isInitialMount && isPageReload();

    if (matchedText && currentPath !== prevPathRef.current && !shouldSkip && !isReloadSkip) {
      setIntroText(matchedText);
    }

    prevPathRef.current = currentPath;
  }, [location.pathname]);

  if (!introText) return null;

  return <IntroScreen text={introText} onFinish={() => setIntroText(null)} />;
}

function Routers() {
  return (
    <Router>
      <IntroManager />

      <Routes >
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='resume' element={< Resume />} />
          <Route path='image' element={< Image />} />
          <Route path='music' element={<Music />} />
          <Route path='color' element={<Color />} />
          <Route path='diy' element={<DIY />} />
        </Route>

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