import { AlertCircle } from "lucide-react";
import { useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/features/ui/select";

function DefaultTaxPreference() {
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

            setTaxName("");
            setTaxType("CGST");
            setTaxRate("");
            setError(null);

        } catch (error) {
            setError(error.message);
        }
    };

    return(
        <div className="md:w-[50%] w-full">
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
                <div className="flex gap-2 items-center justify-between">
                    <Label htmlFor="taxName">Intra State Tax Rate (%)</Label>
                    <Input
                        id="taxName"
                        value={taxName}
                        onChange={(e) => setTaxName(e.target.value)}
                        required
                        placeholder="Enter tax name"
                        className="max-w-60"
                    />
                </div>

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

                <div className="flex gap-2 items-center justify-between">
                    <Label htmlFor="taxRate">Inter State Tax Rate (%)</Label>
                    <Input
                        id="taxRate"
                        type="number"
                        value={taxRate}
                        onChange={(e) => setTaxRate(e.target.value)}
                        required
                        placeholder="Enter tax rate"
                        min="0"
                        className="max-w-60"
                    />
                </div>

                <div className="flex w-full justify-end">
                    <Button type="submit" className="max-w-60">Save Preference</Button>
                </div>
            </form>
        </div>
    );
}

export default DefaultTaxPreference;
