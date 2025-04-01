import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { AlertCircle } from "lucide-react"; 
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function DefaultTaxPreference() {
    const [taxName, setTaxName] = useState("");
    const [taxType, setTaxType] = useState("CGST");
    const [taxRate, setTaxRate] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation: Ensure tax rate is a valid number
        if (isNaN(taxRate) || taxRate < 0) {
            setError("Tax rate must be a non-negative number.");
            return;
        }
        
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/add-tax`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({ taxName, taxType, taxRate: parseFloat(taxRate) }),
            });

            if (!response.ok) {
                throw new Error("Failed to add tax. Please try again.");
            }

            // Reset form on success
            setTaxName("");
            setTaxType("CGST");
            setTaxRate("");
            setError(null);

        } catch (error) {
            setError(error.message);
        }
    };

    return(
        <div>
            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-5 w-5" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <h1 className="text-2xl font-bold">Default Tax Preference</h1>
                {/* Tax Name */}
                <div>
                    <Label htmlFor="taxName">Intra State Tax Rate (%)</Label>
                    <Input
                        id="taxName"
                        value={taxName}
                        onChange={(e) => setTaxName(e.target.value)}
                        required
                        placeholder="Enter tax name"
                    />
                </div>

                {/* Tax Type */}
                {/* <div>
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
                </div> */}

                {/* Tax Rate */}
                <div>
                    <Label htmlFor="taxRate">Inter State Tax Rate (%)</Label>
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

                {/* Submit Button */}
                <Button type="submit" className="w-full">Save Preference</Button>
            </form>
        </div>
    );
}
