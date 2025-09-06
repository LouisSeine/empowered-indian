import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './ProtectedRoute.css';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { loading, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #e2e8f0',
          borderTop: '3px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ color: '#64748b' }}>Checking authentication...</p>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated()) {
    // Redirect to global login route; keep attempted location for post-login return
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to dashboard if admin access required but user is not admin
  if (requireAdmin && !isAdmin()) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem',
        textAlign: 'center',
        padding: '2rem'
      }}>
        <div style={{
          fontSize: '4rem',
          color: '#ef4444'
        }}>🚫</div>
        <h2 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>Access Denied</h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
          You don't have permission to access this area. Admin privileges required.
        </p>
        <button
          onClick={() => window.history.back()}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
