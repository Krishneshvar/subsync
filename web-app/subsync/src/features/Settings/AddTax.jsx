import { AlertCircle } from "lucide-react"; 
import { useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import api from "@/lib/axiosInstance.js"; 

function AddTax() {
    const [taxName, setTaxName] = useState("");
    const [taxType, setTaxType] = useState("CGST");
    const [taxRate, setTaxRate] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isNaN(taxRate) || taxRate < 0) {
            setError("Tax rate must be a non-negative number.");
            return;
        }

        try {
            const requestData = {
                taxName: taxName.trim(),
                taxType: taxType,
                taxRate: parseFloat(taxRate)
            };

            // Use axios instance instead of fetch
            const response = await api.post("/add-tax", requestData);

            if (response.status !== 200) {
                throw new Error(response.data.error || "Failed to add tax. Please try again.");
            }

            setTaxName("");
            setTaxType("CGST");
            setTaxRate("");
            setError(null);

        } catch (error) {
            setError(error.response?.data?.error || error.message);
        }
    };    

    return (
        <div className="w-[250px]">
            <h1 className="text-2xl font-bold mb-4">Add New Tax</h1>

            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-5 w-5" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <Label htmlFor="taxName">Tax Name</Label>
                    <Input
                        id="taxName"
                        value={taxName}
                        onChange={(e) => setTaxName(e.target.value)}
                        required
                        placeholder="Enter tax name"
                    />
                </div>

                <div>
                    <Label htmlFor="taxType">Tax Type</Label>
                    <Select value={taxType} onValueChange={setTaxType}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select tax type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="CGST">CGST</SelectItem>
                            <SelectItem value="SGST">SGST</SelectItem>
                            <SelectItem value="iGST">iGST</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label htmlFor="taxRate">Tax Rate (%)</Label>
                    <Input
                        id="taxRate"
                        type="number"
                        value={taxRate}
                        onChange={(e) => setTaxRate(e.target.value)}
                        required
                        placeholder="Enter tax rate"
                        min="0"
                    />
                </div>

                <Button type="submit" className="w-full">Add Tax</Button>
            </form>
        </div>
    );
}

export default AddTax;