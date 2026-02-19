import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import LoginPage from './Pages/LoginPage';
import SignupPage from './Pages/SignupPage';
import AdminDashboard from './Pages/AdminDashboard';
import UserProfilePage from './Pages/UserProfilePage';
import BoardingFormPage from './Pages/BoardingFormPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignupPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/boarding/add" element={<BoardingFormPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
