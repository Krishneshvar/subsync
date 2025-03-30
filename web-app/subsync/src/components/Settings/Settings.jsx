import { Outlet, Link } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Settings, ChevronDown } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex flex-col md:flex-row w-full h-full gap-2">
      
      {/* 🔹 Large Screen Sidebar (Visible on md and above) */}
      <div className="hidden md:block w-[15%] bg-white shadow-md p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Settings</h2>
        <ul className="flex flex-col space-y-2">
          <Link className="text-gray-700 hover:text-blue-500" to="profile">Profile</Link>
          <Link className="text-gray-700 hover:text-blue-500" to="taxes">Taxes</Link>
        </ul>
      </div>

      {/* 🔹 Small Screen Dropdown (Visible on sm and below) */}
      <div className="md:hidden w-full flex justify-start p-2">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 text-gray-700 hover:text-blue-500">
            <Settings size={18} />
            <span>Settings</span>
            <ChevronDown size={16} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem>
              <Link className="w-full text-gray-700 hover:text-blue-500" to="profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link className="w-full text-gray-700 hover:text-blue-500" to="taxes">Taxes</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 🔹 Main Content */}
      <div className="flex flex-col flex-grow p-4 bg-white shadow-md rounded-lg">
        <Outlet />
      </div>
      
    </div>
  );
}
