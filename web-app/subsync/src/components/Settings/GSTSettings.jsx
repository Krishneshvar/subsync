import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function GSTSettings() {
    const [formDetails, setFormDetails] = useState({
        taxRegistrationNumberLabel: "",
        gstin: "",
        businessLegalName: "",
        businessTradeName: "",
        gstRegisteredOn: "",
    });

    // Handle input changes
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormDetails((prev) => ({ ...prev, [id]: value }));
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Data:", formDetails);
        // You can send `formDetails` to an API here
    };

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
