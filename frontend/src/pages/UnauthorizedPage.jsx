import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '80vh',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <h1 style={{ fontSize: '4rem', color: '#d32f2f', marginBottom: '1rem' }}>403</h1>
      <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Access Denied</h2>
      <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '2rem', maxWidth: '500px' }}>
        You do not have permission to access this page. Please contact your administrator or switch to the appropriate user role.
      </p>
      <Link to="/" style={{ 
        padding: '0.75rem 2rem', 
        backgroundColor: '#2e7d32', 
        color: 'white', 
        textDecoration: 'none', 
        borderRadius: '8px',
        fontWeight: 'bold'
      }}>
        Back to Home
      </Link>
    </div>
  );
};

export default UnauthorizedPage;
