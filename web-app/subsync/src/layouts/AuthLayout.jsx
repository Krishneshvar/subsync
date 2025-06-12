import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { fetchUserDetailsOnLoad } from '@/features/Auth/authSlice';

const AuthLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchUserDetailsOnLoad());
  }, [dispatch]);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate('/login', { replace: true });
      } else {
        if (window.location.pathname === '/login' || window.location.pathname === '/') {
          const user = useSelector((state) => state.auth.user);
          if (user?.username) {
            navigate(`/${user.username}/dashboard`, { replace: true });
          } else {
            navigate('/', { replace: true });
          }
        }
      }
    }
  }, [isAuthenticated, isLoading, navigate, error]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center text-lg font-semibold text-gray-700">Loading authentication...</div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : null;
};

export default AuthLayout;
