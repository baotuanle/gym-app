import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; 
import RegisterUser from './components/register';
import Dashboard from './components/dashboard'; 
import Login from './components/login'; 
import Profile from './components/profile'; 
import TrainerDashboard from './components/trainer-dashboard';
import AdminDashboard from './components/admin-dashboard';
import SearchProfile from './components/searchprofile'; 
import TrainerCalendar from './components/trainer-calendar'; 
import UserCalendar from './components/user-calendar'; 
import Availability from './components/availability'; 
import Book from './components/book-session'; 
import Equipment from './components/equipment';
import EquipmentAll from './components/equipment-all';
import Classes from './components/classes';
import AdminBilling from './components/admin-billing';
import UserBillings from './components/user-billings';
import Rooms from './components/rooms';

function App() {

  const LoggedIn = ({ children }) => {
    const userData = localStorage.getItem('userData');
    if (userData !== null) {
      if (userData.includes("@trainer.com")) {
        return <Navigate to="/trainer-dashboard" />;
      }
      else if (userData.includes("@admin.com")) {
        return <Navigate to="/admin-dashboard" />;
      }
      return children;
    }
    else {
      return <Navigate to="/login" />;
    }
  }

  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegisterUser />} />
        <Route path="/" element={<LoggedIn><Dashboard /></LoggedIn>} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/search-profile/" element={<SearchProfile />} />
        <Route path="/trainer-dashboard" element={<TrainerDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/trainer-calendar" element={<TrainerCalendar />} />
        <Route path="/user-calendar" element={<UserCalendar />} />
        <Route path="/availability" element={<Availability />} />
        <Route path="/book" element={<Book />} />
        <Route path="/equipment" element={<Equipment />} />
        <Route path="/equipment-all" element={<EquipmentAll />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="/admin-billing" element={<AdminBilling />} />
        <Route path="/user-billings" element={<UserBillings />} />
        <Route path="/rooms" element={<Rooms />} />
      </Routes>
    </Router>
  );
}

export default App;
