import { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import api from "@/lib/axiosInstance.js";

function DefaultTaxPreference() {
    const [taxes, setTaxes] = useState([]);
    const [defaultTax, setDefaultTax] = useState(null);
    const [selectedTaxId, setSelectedTaxId] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTaxes();
        fetchDefaultTax();
    }, []);

    const fetchTaxes = async () => {
        try {
            const res = await api.get("/all-taxes");
            setTaxes(res.data.taxes || []);
        } catch (error) {
            setError("Failed to fetch taxes.");
        }
    };

    const fetchDefaultTax = async () => {
        try {
            const res = await api.get("/default-tax-preference");
            setDefaultTax(res.data.defaultTaxPreference || null);
            setSelectedTaxId(res.data.defaultTaxPreference?.tax_id || "");
        } catch (error) {
            setError("Failed to fetch default tax preference.");
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const selectedTax = taxes.find(t => t.tax_id === selectedTaxId);
        if (!selectedTax) {
            setError("Please select a tax to set as default.");
            return;
        }
        try {
            await api.post("/set-default-tax-preference", { tax: selectedTax });
            setDefaultTax(selectedTax);
            setError(null);
        } catch (error) {
            setError("Failed to set default tax preference.");
        }
    };

    return (
        <div className="md:w-[50%] w-full">
            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            <form onSubmit={handleSave} className="flex flex-col gap-4">
                <h1 className="text-2xl font-bold">Default Tax Preference</h1>
                <div>
                    <Select value={selectedTaxId} onValueChange={setSelectedTaxId}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select default tax" />
                        </SelectTrigger>
                        <SelectContent>
                            {taxes.map((tax) => (
                                <SelectItem key={tax.tax_id} value={tax.tax_id}>
                                    {tax.tax_name} ({tax.tax_type}) - {tax.tax_rate}%
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Button type="submit" className="max-w-60">Save Preference</Button>
                {defaultTax && (
                    <div className="mt-2 text-green-700">
                        Current default: <b>{defaultTax.tax_name} ({defaultTax.tax_type}) - {defaultTax.tax_rate}%</b>
                    </div>
                )}
            </form>
        </div>
    );
}

export default DefaultTaxPreference;
