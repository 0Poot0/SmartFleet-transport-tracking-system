import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getLiveLocation } from '../services/api';
import './AdminPanel.css';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Routes state
  const [routes, setRoutes] = useState([
    { id: 1, name: 'Route A - Downtown Express', stops: ['Central Station', 'Main Square', 'City Hall'] },
    { id: 2, name: 'Route B - North Loop', stops: ['North Terminal', 'University Campus'] }
  ]);
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [routeForm, setRouteForm] = useState({ name: '', stops: '' });

  // Vehicles state
  const [vehicles, setVehicles] = useState([
    { id: 1, name: 'Vehicle 1', type: 'Bus', status: 'Active' },
    { id: 2, name: 'Vehicle 2', type: 'Car', status: 'On Route' }
  ]);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [vehicleForm, setVehicleForm] = useState({ name: '', type: 'Bus', status: 'Active' });

  // Schedules state
  const [schedules, setSchedules] = useState([
    { id: 1, route: 'Route A', startTime: '08:00', endTime: '18:00', frequency: '30 min' },
    { id: 2, route: 'Route B', startTime: '09:00', endTime: '19:00', frequency: '45 min' }
  ]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({ route: '', startTime: '', endTime: '', frequency: '' });

  // Live simulation state
  const [liveData, setLiveData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch live location data
  const fetchLiveData = async () => {
    setLoading(true);
    try {
      const data = await getLiveLocation();
      setLiveData(data);
    } catch (error) {
      console.error('Failed to fetch live data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'simulation') {
      fetchLiveData();
    }
  }, [activeTab]);

  // Route handlers
  const handleAddRoute = () => {
    setEditingRoute(null);
    setRouteForm({ name: '', stops: '' });
    setShowRouteModal(true);
  };

  const handleEditRoute = (route) => {
    setEditingRoute(route);
    setRouteForm({ name: route.name, stops: route.stops.join(', ') });
    setShowRouteModal(true);
  };

  const handleSaveRoute = () => {
    const stopsArray = routeForm.stops.split(',').map(s => s.trim()).filter(s => s);
    if (editingRoute) {
      setRoutes(routes.map(r => r.id === editingRoute.id 
        ? { ...r, name: routeForm.name, stops: stopsArray }
        : r
      ));
    } else {
      setRoutes([...routes, { id: Date.now(), name: routeForm.name, stops: stopsArray }]);
    }
    setShowRouteModal(false);
    setRouteForm({ name: '', stops: '' });
  };

  const handleDeleteRoute = (id) => {
    if (window.confirm('Are you sure you want to delete this route?')) {
      setRoutes(routes.filter(r => r.id !== id));
    }
  };

  // Vehicle handlers
  const handleAddVehicle = () => {
    setEditingVehicle(null);
    setVehicleForm({ name: '', type: 'Bus', status: 'Active' });
    setShowVehicleModal(true);
  };

  const handleEditVehicle = (vehicle) => {
    setEditingVehicle(vehicle);
    setVehicleForm({ name: vehicle.name, type: vehicle.type, status: vehicle.status });
    setShowVehicleModal(true);
  };

  const handleSaveVehicle = () => {
    if (editingVehicle) {
      setVehicles(vehicles.map(v => v.id === editingVehicle.id 
        ? { ...v, ...vehicleForm }
        : v
      ));
    } else {
      setVehicles([...vehicles, { id: Date.now(), ...vehicleForm }]);
    }
    setShowVehicleModal(false);
    setVehicleForm({ name: '', type: 'Bus', status: 'Active' });
  };

  const handleDeleteVehicle = (id) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      setVehicles(vehicles.filter(v => v.id !== id));
    }
  };

  // Schedule handlers
  const handleAddSchedule = () => {
    setScheduleForm({ route: '', startTime: '', endTime: '', frequency: '' });
    setShowScheduleModal(true);
  };

  const handleSaveSchedule = () => {
    setSchedules([...schedules, { id: Date.now(), ...scheduleForm }]);
    setShowScheduleModal(false);
    setScheduleForm({ route: '', startTime: '', endTime: '', frequency: '' });
  };

  const formatTimestamp = (ts) => {
    try {
      return new Date(ts).toLocaleString();
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="admin-panel">
      <Navbar />
      <div className="admin-container">
        {/* Sidebar */}
        <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-header">
            <h2>Admin Panel</h2>
            <button 
              className="sidebar-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? '←' : '→'}
            </button>
          </div>
          <nav className="sidebar-menu">
            <button
              className={`menu-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard Home
            </button>
            <button
              className={`menu-item ${activeTab === 'routes' ? 'active' : ''}`}
              onClick={() => setActiveTab('routes')}
            >
              Manage Routes
            </button>
            <button
              className={`menu-item ${activeTab === 'vehicles' ? 'active' : ''}`}
              onClick={() => setActiveTab('vehicles')}
            >
              Manage Vehicles
            </button>
            <button
              className={`menu-item ${activeTab === 'schedules' ? 'active' : ''}`}
              onClick={() => setActiveTab('schedules')}
            >
              Manage Schedules
            </button>
            <button
              className={`menu-item ${activeTab === 'simulation' ? 'active' : ''}`}
              onClick={() => setActiveTab('simulation')}
            >
              Live Simulation Data
            </button>
          </nav>
        </aside>

        {/* Content Area */}
        <main className="admin-content">
          {activeTab === 'dashboard' && (
            <div className="dashboard-welcome">
              <h1>Welcome to Admin Panel</h1>
              <p>Manage your transport system from here. Select a menu item to get started.</p>
              <div className="dashboard-stats">
                <div className="stat-card">
                  <h3>{routes.length}</h3>
                  <p>Total Routes</p>
                </div>
                <div className="stat-card">
                  <h3>{vehicles.length}</h3>
                  <p>Total Vehicles</p>
                </div>
                <div className="stat-card">
                  <h3>{schedules.length}</h3>
                  <p>Active Schedules</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'routes' && (
            <div className="admin-section">
              <div className="section-header">
                <h2>Manage Routes</h2>
                <button className="btn-primary" onClick={handleAddRoute}>
                  + Add Route
                </button>
              </div>
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Route Name</th>
                      <th>Stops Count</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {routes.map(route => (
                      <tr key={route.id}>
                        <td>{route.name}</td>
                        <td>{route.stops.length}</td>
                        <td>
                          <button className="btn-edit" onClick={() => handleEditRoute(route)}>
                            Edit
                          </button>
                          <button className="btn-delete" onClick={() => handleDeleteRoute(route.id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'vehicles' && (
            <div className="admin-section">
              <div className="section-header">
                <h2>Manage Vehicles</h2>
                <button className="btn-primary" onClick={handleAddVehicle}>
                  + Add Vehicle
                </button>
              </div>
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Vehicle Name</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicles.map(vehicle => (
                      <tr key={vehicle.id}>
                        <td>{vehicle.name}</td>
                        <td>{vehicle.type}</td>
                        <td>
                          <span className={`status-badge status-${vehicle.status.toLowerCase().replace(' ', '-')}`}>
                            {vehicle.status}
                          </span>
                        </td>
                        <td>
                          <button className="btn-edit" onClick={() => handleEditVehicle(vehicle)}>
                            Edit
                          </button>
                          <button className="btn-delete" onClick={() => handleDeleteVehicle(vehicle.id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'schedules' && (
            <div className="admin-section">
              <div className="section-header">
                <h2>Manage Schedules</h2>
                <button className="btn-primary" onClick={handleAddSchedule}>
                  + Add Schedule
                </button>
              </div>
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Route</th>
                      <th>Start Time</th>
                      <th>End Time</th>
                      <th>Frequency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {schedules.map(schedule => (
                      <tr key={schedule.id}>
                        <td>{schedule.route}</td>
                        <td>{schedule.startTime}</td>
                        <td>{schedule.endTime}</td>
                        <td>{schedule.frequency}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'simulation' && (
            <div className="admin-section">
              <div className="section-header">
                <h2>Live Simulation Data</h2>
                <button className="btn-primary" onClick={fetchLiveData} disabled={loading}>
                  {loading ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
              {liveData ? (
                <div className="simulation-data">
                  <div className="data-card">
                    <div className="data-item">
                      <span className="data-label">Speed:</span>
                      <span className="data-value">{liveData.speed || 0} km/h</span>
                    </div>
                    <div className="data-item">
                      <span className="data-label">Latitude:</span>
                      <span className="data-value">{liveData.latitude || liveData.lat || 'N/A'}</span>
                    </div>
                    <div className="data-item">
                      <span className="data-label">Longitude:</span>
                      <span className="data-value">{liveData.longitude || liveData.lng || liveData.lon || 'N/A'}</span>
                    </div>
                    <div className="data-item">
                      <span className="data-label">Timestamp:</span>
                      <span className="data-value">{formatTimestamp(liveData.timestamp)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="loading-state">Click Refresh to load live data</div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Route Modal */}
      {showRouteModal && (
        <div className="modal-overlay" onClick={() => setShowRouteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingRoute ? 'Edit Route' : 'Add Route'}</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveRoute(); }}>
              <div className="form-group">
                <label>Route Name</label>
                <input
                  type="text"
                  value={routeForm.name}
                  onChange={(e) => setRouteForm({ ...routeForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Stops (comma-separated)</label>
                <input
                  type="text"
                  value={routeForm.stops}
                  onChange={(e) => setRouteForm({ ...routeForm, stops: e.target.value })}
                  placeholder="Stop1, Stop2, Stop3"
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowRouteModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Vehicle Modal */}
      {showVehicleModal && (
        <div className="modal-overlay" onClick={() => setShowVehicleModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{editingVehicle ? 'Edit Vehicle' : 'Add Vehicle'}</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveVehicle(); }}>
              <div className="form-group">
                <label>Vehicle Name</label>
                <input
                  type="text"
                  value={vehicleForm.name}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select
                  value={vehicleForm.type}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, type: e.target.value })}
                  required
                >
                  <option value="Bus">Bus</option>
                  <option value="Car">Car</option>
                  <option value="Auto">Auto</option>
                  <option value="Truck">Truck</option>
                  <option value="Van">Van</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={vehicleForm.status}
                  onChange={(e) => setVehicleForm({ ...vehicleForm, status: e.target.value })}
                  required
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="On Route">On Route</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowVehicleModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="modal-overlay" onClick={() => setShowScheduleModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Add Schedule</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveSchedule(); }}>
              <div className="form-group">
                <label>Route</label>
                <select
                  value={scheduleForm.route}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, route: e.target.value })}
                  required
                >
                  <option value="">Select Route</option>
                  {routes.map(route => (
                    <option key={route.id} value={route.name}>{route.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Start Time</label>
                <input
                  type="time"
                  value={scheduleForm.startTime}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, startTime: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>End Time</label>
                <input
                  type="time"
                  value={scheduleForm.endTime}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, endTime: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Frequency</label>
                <input
                  type="text"
                  value={scheduleForm.frequency}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, frequency: e.target.value })}
                  placeholder="e.g., 30 min"
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowScheduleModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AdminPanel;

