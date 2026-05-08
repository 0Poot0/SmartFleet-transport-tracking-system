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
import PassengerPage from './pages/PassengerPage';
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
import ProtectedRoute from './components/ProtectedRoute';
import UnauthorizedPage from './pages/UnauthorizedPage';
import { isAdminLoggedIn, logoutUser } from './utils/auth';
import LiveLocation from './components/LiveLocation';
import ETA from './components/ETA';
import Navbar from './components/Navbar';
import './styles.css';



function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
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
            <Route path="/passenger" element={<ProtectedRoute requiredRole="passenger"><PassengerPage /></ProtectedRoute>} />
            <Route path="/passenger/home" element={<PassengerHome />} />
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
            <Route path="/unauthorized" element={<UnauthorizedPage />} />
            <Route path="/dashboard" element={<ProtectedRoute requiredRole="admin"><Dashboard /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute requiredRole="admin"><AdvancedAnalytics /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminPanel /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
