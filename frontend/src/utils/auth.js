// Authentication utility functions

export const loginUser = (role, token) => {
  localStorage.setItem('userRole', role);
  localStorage.setItem('token', token);
  window.dispatchEvent(new Event('storage'));
};

export const logoutUser = () => {
  localStorage.removeItem('userRole');
  localStorage.removeItem('token');
  window.dispatchEvent(new Event('storage'));
};

export const getUserRole = () => {
  return localStorage.getItem('userRole');
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Backward compatibility
export const isAdminLoggedIn = () => {
  return localStorage.getItem('userRole') === 'admin';
};
