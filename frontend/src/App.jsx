import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RoutesPage from './pages/RoutesPage';
import VehiclesPage from './pages/VehiclesPage';
import LiveTrackingPage from './pages/LiveTrackingPage';
import AdminPanel from './pages/AdminPanel';
import Dashboard from './pages/Dashboard';
import AdvancedAnalytics from './pages/AdvancedAnalytics';
import RouteDetailsPage from './pages/RouteDetailsPage';
import VehicleDetailsPage from './pages/VehicleDetailsPage';
import StopDetailsPage from './pages/StopDetailsPage';
import RoutePlaybackPage from './pages/RoutePlaybackPage';
import PassengerHome from './passenger/PassengerHome';
import PassengerRoutes from './passenger/PassengerRoutes';
import PassengerRouteDetails from './passenger/PassengerRouteDetails';
import PassengerLiveTracking from './passenger/PassengerLiveTracking';
import PassengerSearch from './passenger/PassengerSearch';
import TicketBookingPage from './pages/TicketBookingPage';
import TicketConfirmationPage from './pages/TicketConfirmationPage';
import PaymentPage from './pages/PaymentPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailedPage from './pages/PaymentFailedPage';
import LoginPage from './pages/LoginPage';
import RequireAdmin from './components/RequireAdmin';
import { isAdminLoggedIn, logoutAdmin } from './utils/auth';
import LiveLocation from './components/LiveLocation';
import ETA from './components/ETA';
import './styles.css';

function AppHeader() {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsAdmin(isAdminLoggedIn());
    
    const handleStorageChange = () => {
      setIsAdmin(isAdminLoggedIn());
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    logoutAdmin();
    setIsAdmin(false);
    navigate('/login');
  };

  return (
    <header className="header">
      <h1>Transport Tracker</h1>
      <nav className="navbar">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/live" className="nav-link">Live Location</Link>
        <Link to="/routes" className="nav-link">Routes</Link>
        <Link to="/vehicles" className="nav-link">Vehicles</Link>
        <Link to="/eta" className="nav-link">ETA</Link>
        {isAdmin && (
          <>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/analytics" className="nav-link">Analytics</Link>
            <Link to="/admin" className="nav-link">Admin</Link>
            <button onClick={handleLogout} className="nav-link logout-button">
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
}

function App() {
  return (
    <Router>
      <div className="app">
        <AppHeader />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/live" element={<LiveTrackingPage />} />
            <Route path="/routes" element={<RoutesPage />} />
            <Route path="/route/:id" element={<RouteDetailsPage />} />
            <Route path="/route-playback/:id" element={<RoutePlaybackPage />} />
            <Route path="/vehicles" element={<VehiclesPage />} />
            <Route path="/vehicle/:id" element={<VehicleDetailsPage />} />
            <Route path="/stop/:id" element={<StopDetailsPage />} />
            <Route path="/passenger" element={<PassengerHome />} />
            <Route path="/passenger/routes" element={<PassengerRoutes />} />
            <Route path="/passenger/route/:id" element={<PassengerRouteDetails />} />
            <Route path="/passenger/live/:id" element={<PassengerLiveTracking />} />
            <Route path="/passenger/search" element={<PassengerSearch />} />
            <Route path="/ticket-booking" element={<TicketBookingPage />} />
            <Route path="/ticket-confirmation" element={<TicketConfirmationPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/payment-success" element={<PaymentSuccessPage />} />
            <Route path="/payment-failed" element={<PaymentFailedPage />} />
            <Route path="/eta" element={<ETA />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<RequireAdmin><Dashboard /></RequireAdmin>} />
            <Route path="/analytics" element={<RequireAdmin><AdvancedAnalytics /></RequireAdmin>} />
            <Route path="/admin" element={<RequireAdmin><AdminPanel /></RequireAdmin>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
