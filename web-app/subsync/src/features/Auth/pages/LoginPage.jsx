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

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, isLoading, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && !isLoading && !error) {
      navigate(`/${username}/dashboard`);
    }
    // Also, clear any error when component mounts or user starts typing again
    // (You'd need a clearLoginError action in your authSlice for this, which was suggested previously)
    // if (error) {
    //   dispatch(clearLoginError()); // Uncomment if you add this action
    // }
  }, [isAuthenticated, isLoading, error, navigate, username, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Dispatch the loginUser async thunk
    // The state (isLoading, error, isAuthenticated) will be updated by the thunk's lifecycle
    await dispatch(loginUser({ username, password }));
    // Navigation is now handled by the useEffect above
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tl from-cyan-500 to-blue-500">
      <Card className="w-80 max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <Terminal className="h-4 w-4" /> {/* Optional icon */}
              <AlertTitle>Login Failed!</AlertTitle>
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter username"
                className="shadow-sm border-2 border-gray-300 focus:border-blue-500"
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
                  className="shadow-sm border-2 border-gray-300 focus:border-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4 text-gray-500" />
                  ) : (
                    <EyeIcon className="h-4 w-4 text-gray-500" />
                  )}
                </button>
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
  );
}
