import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function AllTaxes() {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchTaxes = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/all-taxes`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                    },
                    credentials: "include",
                });

                const result = await response.json();
                setData(result.taxes || []);
            } catch (error) {
                console.error("Error fetching taxes:", error);
            }
        };

        fetchTaxes();
    }, []);

    const onDelete = async (tax_id) => {
        if (!window.confirm("Are you sure you want to delete this tax?")) return;
    
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/delete-tax/${tax_id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                credentials: "include",
            });
    
            if (!response.ok) {
                throw new Error(`Failed to delete tax (Status: ${response.status})`);
            }
    
            setData((prevData) => prevData.filter((item) => item.tax_id !== tax_id));
        } catch (error) {
            console.error("Error deleting tax:", error);
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
                                    <Link to={`edit/${item.tax_id}`}>
                                        <Button variant="ghost" size="icon" aria-label={`Edit ${item.taxName || "tax"}`}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    </Link>
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
