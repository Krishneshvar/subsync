import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "../../lib/axiosInstance";

function GSTSettings() {
    const [formDetails, setFormDetails] = useState({
        taxRegistrationNumberLabel: "",
        gstin: "",
        businessLegalName: "",
        businessTradeName: "",
        gstRegisteredOn: "",
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGSTSettings = async () => {
            try {
                const response = await api.get("/gst-settings");
                const data = response.data;

                if (!data.success) {
                    throw new Error(data.error || "GST settings retrieval failed.");
                }

                setFormDetails(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching GST settings:", error.message);
                setError("Failed to load GST settings.");
                setLoading(false);
            }
        };

        fetchGSTSettings();
    }, []);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormDetails((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            console.log("Form Data:", formDetails);

            const response = await api.put("/update-gst-settings", formDetails);
            console.log("Response:", response);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to update GST settings.");
            }

            alert("GST Settings updated successfully!");
        } catch (error) {
            console.error("Error updating GST settings:", error.message);
            alert("Error updating GST settings.");
        }
    };

    if (loading) return <p>Loading GST settings...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="md:w-[50%] w-full">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <h1 className="text-2xl font-bold mb-4">GST Settings</h1>

                <div className="flex flex-col md:flex-row justify-between items-center gap-2">
                    <Label htmlFor="taxRegistrationNumberLabel">Tax Registration Number Label</Label>
                    <Input
                        id="taxRegistrationNumberLabel"
                        required
                        value={formDetails.taxRegistrationNumberLabel}
                        onChange={handleChange}
                        className="max-w-60"
                        placeholder="Enter Label"
                    />
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-2">
                    <Label htmlFor="gstin">GSTIN</Label>
                    <Input
                        id="gstin"
                        required
                        value={formDetails.gstin}
                        onChange={handleChange}
                        className="max-w-60"
                        placeholder="Enter GSTIN"
                    />
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-2">
                    <Label htmlFor="businessLegalName">Business Legal Name</Label>
                    <Input
                        id="businessLegalName"
                        required
                        value={formDetails.businessLegalName}
                        onChange={handleChange}
                        className="max-w-60"
                        placeholder="Enter Name"
                    />
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-2">
                    <Label htmlFor="businessTradeName">Business Trade Name</Label>
                    <Input
                        id="businessTradeName"
                        required
                        value={formDetails.businessTradeName}
                        onChange={handleChange}
                        className="max-w-60"
                        placeholder="Enter Name"
                    />
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-2">
                    <Label htmlFor="gstRegisteredOn" className="mb-2">GST Registered On</Label>
                    <input
                        type="date"
                        id="gstRegisteredOn"
                        className="flex flex-grow-1 py-2 px-1 border-1 border-gray-100 max-w-60 shadow-md rounded-md"
                        value={formDetails.gstRegisteredOn}
                        onChange={handleChange}
                    />
                </div>

                <Button type="submit">Save</Button>
            </form>
        </div>
    );
}

export default GSTSettings;
