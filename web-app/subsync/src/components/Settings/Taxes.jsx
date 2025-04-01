import { Outlet, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react"; // Icon for dropdown

const categories = [
    { name: "Tax Rates", path: "tax-rates" },
    { name: "Default Tax Preference", path: "default-tax-pref" },
    { name: "GST Settings", path: "gst-settings" }
];

export default function Taxes() {
    const location = useLocation();
    const [selectedCategory, setSelectedCategory] = useState(
        categories.find(cat => location.pathname.endsWith(cat.path)) || categories[0]
    );

    return (
        <div className="flex flex-col h-full w-full">
            {/* Header (Shows dropdown on small screens) */}
            <div className="border-b border-gray-300 p-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Taxes</h1>

                {/* Dropdown for small screens */}
                <div className="lg:hidden">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="flex items-center gap-2">
                                {selectedCategory.name} <ChevronDown className="w-4 h-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent align="end" className="w-48">
                            <ul className="space-y-2">
                                {categories.map((category) => (
                                    <li key={category.path}>
                                        <Link
                                            to={category.path} // Relative path
                                            onClick={() => setSelectedCategory(category)}
                                            className={`block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100`}
                                        >
                                            {category.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            <div className="flex flex-row flex-grow">
                {/* Sidebar (Hidden on small screens) */}
                <div className="hidden lg:block w-[15%] border-r border-gray-300 p-4">
                    <ul className="mt-3 space-y-2">
                        {categories.map((category) => {
                            const isActive = location.pathname.endsWith(category.path);
                            return (
                                <li key={category.path}>
                                    <Link
                                        to={category.path} // Relative path
                                        className={`block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 ${
                                            isActive ? "bg-blue-500 text-white" : ""
                                        }`}
                                    >
                                        {category.name}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* Content Area */}
                <div className="flex flex-col flex-grow p-4">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
