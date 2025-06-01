import { Outlet } from "react-router-dom";

function SettingsPage() {
  return (
    <div className="flex flex-col md:flex-row w-full h-full gap-2">
      <div className="flex flex-col flex-grow p-4 bg-white shadow-md rounded-lg">
        <Outlet />
      </div>
    </div>
  );
}

export default SettingsPage;
