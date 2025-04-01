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
        <div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold mb-4">GST Settings</h1>

                <div>
                    <Label htmlFor="taxRegistrationNumberLabel">Tax Registration Number Label</Label>
                    <Input
                        id="taxRegistrationNumberLabel"
                        required
                        value={formDetails.taxRegistrationNumberLabel}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <Label htmlFor="gstin">GSTIN</Label>
                    <Input
                        id="gstin"
                        required
                        value={formDetails.gstin}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <Label htmlFor="businessLegalName">Business Legal Name</Label>
                    <Input
                        id="businessLegalName"
                        required
                        value={formDetails.businessLegalName}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <Label htmlFor="businessTradeName">Business Trade Name</Label>
                    <Input
                        id="businessTradeName"
                        required
                        value={formDetails.businessTradeName}
                        onChange={handleChange}
                    />
                </div>

                <div className="flex flex-col">
                    <Label htmlFor="gstRegisteredOn" className="mb-2">GST Registered On</Label>
                    <input
                        type="date"
                        id="gstRegisteredOn"
                        className="py-2 px-1 border-1 border-gray-100 shadow-md rounded-md"
                        value={formDetails.gstRegisteredOn}
                        onChange={handleChange}
                    />
                </div>

                <Button type="submit">Save</Button>
            </form>
        </div>
    );
}
