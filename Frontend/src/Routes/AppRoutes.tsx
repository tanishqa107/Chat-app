import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import ChatPage from '../pages/ChatPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path='/chatpage' element={<ChatPage />} />
    </Routes>
  );
};

export default AppRoutes;
