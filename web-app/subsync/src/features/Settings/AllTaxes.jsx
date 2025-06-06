import { Pencil, Trash2, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import api from "@/lib/axiosInstance.js";

function AllTaxes() {
    const [data, setData] = useState([]);
    const [defaultTax, setDefaultTax] = useState(null);

    useEffect(() => {
        fetchTaxes();
        fetchDefaultTax();
    }, []);

    const fetchTaxes = async () => {
        try {
            const res = await api.get("/all-taxes");
            setData(res.data.taxes || []);
        } catch (error) {
            console.error("Error fetching taxes:", error);
        }
    };

    const fetchDefaultTax = async () => {
        try {
            const res = await api.get("/default-tax-preference");
            setDefaultTax(res.data.defaultTaxPreference || null);
        } catch (error) {
            console.error("Error fetching default tax:", error);
        }
    };

    const onDelete = async (tax_id) => {
        if (!window.confirm("Are you sure you want to delete this tax?")) return;
    
        try {
            await api.delete(`/delete-tax/${tax_id}`);
            setData((prev) => prev.filter((item) => item.tax_id !== tax_id));
            if (defaultTax && defaultTax.tax_id === tax_id) setDefaultTax(null);
        } catch (error) {
            console.error("Error deleting tax:", error);
        }
    };    

    const setAsDefault = async (tax) => {
        try {
            await api.post("/set-default-tax-preference", { tax });
            setDefaultTax(tax);
        } catch (error) {
            console.error("Error setting default tax:", error);
        }
    };

    return (
        <>
            <div className="w-full flex flex-row justify-between items-center">
                <h1 className="text-2xl font-bold mb-4">All Taxes</h1>
                <Link to="add" className="bg-blue-500 rounded-lg px-4 py-1 text-white">
                    Add Tax
                </Link>
            </div>
            <div className="w-full">
                <Table>
                    <TableHeader className="bg-blue-500">
                        <TableRow>
                            <TableHead className="text-white">Tax Name</TableHead>
                            <TableHead className="text-white">Tax Type</TableHead>
                            <TableHead className="text-white">Tax Rate</TableHead>
                            <TableHead className="text-white">Default</TableHead>
                            <TableHead className="text-white">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item.tax_id}>
                                <TableCell>{item.tax_name || "N/A"}</TableCell>
                                <TableCell>{item.tax_type || "N/A"}</TableCell>
                                <TableCell>{item.tax_rate || "N/A"}</TableCell>
                                <TableCell>
                                    {defaultTax && defaultTax.tax_id === item.tax_id ? (
                                        <Star className="text-yellow-500" />
                                    ) : (
                                        <Button variant="ghost" size="icon" onClick={() => setAsDefault(item)} title="Set as default">
                                            <Star className="text-gray-400" />
                                        </Button>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Button asChild variant="ghost" size="icon" aria-label={`Edit ${item.tax_name || "tax"}`}>
                                        <a href={`edit/${item.tax_id}`}>
                                            <Pencil className="h-4 w-4" />
                                        </a>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        aria-label={`Delete ${item.tax_name || "tax"}`}
                                        onClick={() => onDelete(item.tax_id)}
                                    >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    );
}

export default AllTaxes;
