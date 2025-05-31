import { HelpCircle, User, Settings, LogOut, X } from "lucide-react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import { Button } from "@/components/ui/button.jsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.jsx";

import { logout } from "@/features/Auth/authSlice";

const navItems = [
  { path: "help", title: "Help", key: "help", icon: HelpCircle },
  { path: "logout", title: "Logout", key: "logout", icon: LogOut },
];

function NavBar({ toggleSidebar }) {
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md rounded-b-lg border-b-2 border-gray-300">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div className="flex">
          <Button variant="ghost" size="icon" className="mr-2 lg:hidden" onClick={toggleSidebar}>
            <span className="material-symbols-outlined">menu</span>
          </Button>
          <div className="flex-shrink-0 flex items-center">
            <span className="text-xl font-bold text-primary">SubSync</span>
          </div>
        </div>
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="h-6 w-6 p-3 rounded-full hover:bg-gray-100" 
            onClick={() => setSettingsOpen(true)}
          >
            <Settings className="h-6 w-6" />
          </Button>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-3 rounded-full border-1 border-gray-300">
                <User />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48" align="end">
              {navItems.map((item) => (
                item.key === "logout" ? (
                  <button
                    key={item.key}
                    className="flex items-center w-full px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                    onClick={() => {
                      setOpen(false);
                      handleLogout();
                    }}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </button>
                ) : (
                  <Link
                    key={item.key}
                    to={item.path}
                    className="flex items-center px-2 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                    onClick={() => setOpen(false)}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </Link>
                )
              ))}
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {settingsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setSettingsOpen(false)}>
          <div 
            className="fixed top-0 right-0 w-80 h-full bg-white shadow-lg z-50 p-4 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Settings</h2>
              <Button variant="ghost" size="icon" onClick={() => setSettingsOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <ul className="flex flex-col space-y-2">
              <Link className="text-gray-700 hover:text-blue-500" to="settings/profile" onClick={() => setSettingsOpen(false)}>Profile</Link>
              <Link className="text-gray-700 hover:text-blue-500" to="settings/taxes/tax-rates" onClick={() => setSettingsOpen(false)}>Taxes</Link>
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
}

export default NavBar;
