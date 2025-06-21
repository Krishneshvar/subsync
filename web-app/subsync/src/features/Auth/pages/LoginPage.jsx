import { Eye, EyeOff, Terminal } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer, Bounce } from 'react-toastify';
import { useState, useEffect } from 'react';

import { loginUser } from '../authSlice';

import 'react-toastify/dist/ReactToastify.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, isLoading, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && !isLoading && !error) {
      const loggedInUsername = (typeof window !== "undefined" && JSON.parse(sessionStorage.getItem('subsync_user'))?.username)
        || '';
      
      toast.success("Login successful!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
      });

      setTimeout(() => {
        navigate(`/${loggedInUsername}/dashboard`);
      }, 2000);
    }
  }, [isAuthenticated, isLoading, error, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(loginUser({ username, password }));
  };

  return (
    <>
      <ToastContainer />
      <div className={`min-h-screen flex items-center justify-center transition-all duration-700 relative overflow-hidden ${
        showPassword ? 'bg-black' : 'bg-gradient-to-tl from-cyan-500 to-blue-500'
      }`}>

        {showPassword && (
          <div className="absolute inset-0 pointer-events-none z-10">
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                background: `radial-gradient(ellipse 800px 400px at center 50%, 
                  rgba(255, 255, 255, 0.15) 0%, 
                  rgba(255, 255, 255, 0.08) 30%, 
                  rgba(255, 255, 255, 0.03) 50%, 
                  transparent 70%)`
              }}
            />

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative w-96 h-96">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute top-1/2 left-1/2 origin-left h-0.5 bg-gradient-to-r from-yellow-200/40 via-white/30 to-transparent animate-pulse"
                    style={{
                      width: '200px',
                      transform: `translate(-50%, -50%) rotate(${i * 30}deg)`,
                      animationDelay: `${i * 0.1}s`,
                      animationDuration: '2s'
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div 
                className="w-2 bg-gradient-to-b from-yellow-300/60 via-yellow-200/40 to-transparent animate-beam-pulse"
                style={{ height: '60px' }}
              />
            </div>
          </div>
        )}

        {showPassword && (
          <div
            className="absolute inset-0 z-5 pointer-events-none transition-opacity duration-700"
            style={{
              background: `radial-gradient(ellipse 600px 300px at center 50%,
                transparent 0%,
                transparent 20%,
                rgba(0, 0, 0, 0.7) 40%,
                rgba(0, 0, 0, 0.95) 70%,
                rgba(0, 0, 0, 1) 100%)`
            }}
          />
        )}

        <div className={`w-80 max-w-md p-6 rounded-lg transition-all duration-700 relative z-20 ${
          showPassword
            ? 'bg-gradient-to-b from-gray-900/90 to-black/90 border border-yellow-400/30 shadow-[0_0_60px_rgba(255,255,0,0.3)]'
            : 'bg-white shadow-lg border border-gray-200'
        }`}>
          <div className="mb-6">
            <h1 className={`text-2xl font-bold text-center transition-colors duration-700 ${
              showPassword ? 'text-yellow-200' : 'text-gray-900'
            }`}>
              Sign In
            </h1>
          </div>

          <div className="mb-6">
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-center">
                <Terminal className="h-4 w-4 mr-2" />
                <div>
                  <div className="font-semibold">Login Failed!</div>
                  <div className="text-sm">{error}</div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className={`block text-sm font-medium transition-colors duration-700 ${
                  showPassword ? 'text-yellow-100' : 'text-gray-700'
                }`}>
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  className={`w-full px-3 py-2 border-2 rounded-md shadow-sm transition-all duration-700 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                    showPassword
                      ? 'bg-gray-800/50 text-yellow-100 border-yellow-400/30 focus:border-yellow-400 focus:ring-yellow-400'
                      : 'bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className={`block text-sm font-medium transition-colors duration-700 ${
                  showPassword ? 'text-yellow-100' : 'text-gray-700'
                }`}>
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    className={`w-full px-3 py-2 pr-10 border-2 rounded-md shadow-sm transition-all duration-700 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                      showPassword
                        ? 'bg-yellow-50/10 text-yellow-100 border-yellow-400/50 focus:border-yellow-400 focus:ring-yellow-400 shadow-[0_0_20px_rgba(255,255,0,0.2)]'
                        : 'bg-white text-gray-900 border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    }`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-all duration-300 z-30 focus:outline-none ${
                      showPassword ? 'text-yellow-300' : 'text-gray-500'
                    }`}
                  >
                    {showPassword ? (
                      <div className="relative">
                        <EyeOff className="h-4 w-4" />
                        <div className="absolute inset-0 bg-yellow-300/30 blur-sm rounded-full animate-pulse"></div>
                        <div className="absolute inset-0 bg-yellow-400/20 blur-md rounded-full animate-pulse"></div>
                      </div>
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>

                  {showPassword && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-200/10 via-yellow-300/5 to-yellow-200/10 animate-shimmer"></div>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                onClick={handleSubmit}
                className={`w-full py-2 px-4 rounded-md font-medium transition-all duration-700 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                  showPassword
                    ? 'bg-yellow-600 hover:bg-yellow-500 text-black shadow-[0_0_20px_rgba(255,255,0,0.3)] focus:ring-yellow-400'
                    : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500'
                }`}
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </div>

          <div className="text-center">
            <a href="#" className={`text-sm hover:underline transition-colors duration-700 ${
              showPassword ? 'text-yellow-300 hover:text-yellow-200' : 'text-blue-600 hover:text-blue-700'
            }`}>
              Forgot your password?
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        @keyframes beam-pulse {
          0%, 100% {
            opacity: 0.6;
            transform: scaleY(1);
          }
          50% {
            opacity: 1;
            transform: scaleY(1.2);
          }
        }
        
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
        
        .animate-beam-pulse {
          animation: beam-pulse 2s infinite;
        }
      `}</style>
    </>
  );
}

export default LoginPage;
