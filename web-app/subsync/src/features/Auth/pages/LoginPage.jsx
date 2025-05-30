import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../authSlice';
// Shadcn UI imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { EyeIcon, EyeOffIcon, Terminal } from "lucide-react";
import { toast, ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, isLoading, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && !isLoading && !error) {
      const loggedInUsername = (typeof window !== "undefined" && JSON.parse(localStorage.getItem('subsync_user'))?.username)
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
      <div className={`min-h-screen flex items-center justify-center transition-all duration-500 ${
        showPassword ? 'bg-black' : 'bg-gradient-to-tl from-cyan-500 to-blue-500'
      }`}>
        <Card className={`w-80 max-w-md transition-all duration-300 ${
          showPassword ? 'bg-gradient-to-r from-yellow-100 to-yellow-50 shadow-[0_0_50px_rgba(255,255,0,0.2)]' : ''
        }`}>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Login Failed!</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  className={`shadow-sm border-2 border-gray-300 focus:border-blue-500 transition-all duration-300 ${
                    showPassword ? 'bg-yellow-50 text-black' : 'bg-white'
                  }`}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    className={`shadow-sm border-2 border-gray-300 focus:border-blue-500 transition-all duration-300 ${
                      showPassword ? 'bg-yellow-50 text-black' : 'bg-white'
                    }`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-all duration-300 ${
                      showPassword ? 'text-yellow-600 animate-pulse' : 'text-gray-500'
                    }`}
                  >
                    {showPassword ? (
                      <div className="relative">
                        <EyeOffIcon className="h-4 w-4" />
                        <div className="absolute inset-0 bg-yellow-200 opacity-50 blur-md rounded-full animate-pulse"></div>
                      </div>
                    ) : (
                      <EyeIcon className="h-4 w-4" />
                    )}
                  </button>
                  {showPassword && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-200/20 to-transparent animate-shine"></div>
                    </div>
                  )}
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <a href="#" className="text-sm text-blue-600 hover:underline">
              Forgot your password?
            </a>
          </CardFooter>
        </Card>
      </div>
      <style jsx>{`
        @keyframes shine {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(100%);
          }
        }
        .animate-shine {
          animation: shine 2s infinite;
        }
      `}</style>
    </>
  );
}
