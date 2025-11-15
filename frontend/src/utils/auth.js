// Authentication utility functions

export const isAdminLoggedIn = () => {
  const adminStatus = localStorage.getItem('isAdmin');
  return adminStatus === 'true';
};

export const logoutAdmin = () => {
  localStorage.removeItem('isAdmin');
};

export const loginAdmin = () => {
  localStorage.setItem('isAdmin', 'true');
};

