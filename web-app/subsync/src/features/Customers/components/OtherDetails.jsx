import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const OtherDetails = ({ customerData, handleInputChange, handleSelectChange }) => {
  const currencyOptions = ["INR", "USD", "EUR"];
  const gstTreatmentOptions = ["iGST", "CGST & SGST", "No GST", "Zero Tax", "SEZ"];
  const taxPreferenceOptions = ["Taxable", "Tax Exempt"];

  // Set default values if not set
  const currencyValue = customerData.currencyCode || "INR";
  const gstTreatmentValue = customerData.gst_treatment || "CGST & SGST";

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="gstin">GSTIN</Label>
          <Input
            id="gstin"
            name="gstin"
            value={customerData.gstin}
            onChange={handleInputChange}
            required
            className="rounded-xl px-4 py-3 text-base border border-gray-300"
          />
        </div>

        <div className="space-y-2">
          <Label>Currency Code</Label>
          <Select
            value={currencyValue}
            onValueChange={(value) => handleSelectChange("currencyCode", value)}
          >
            <SelectTrigger className="w-full rounded-xl px-4 py-3 text-base border border-gray-300">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {currencyOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>GST Treatment</Label>
          <Select
            value={gstTreatmentValue}
            onValueChange={(value) => handleSelectChange("gst_treatment", value)}
          >
            <SelectTrigger className="w-full rounded-xl px-4 py-3 text-base border border-gray-300">
              <SelectValue placeholder="Select treatment" />
            </SelectTrigger>
            <SelectContent>
              {gstTreatmentOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Tax Preference</Label>
          <Select
            value={customerData.tax_preference || ""}
            onValueChange={(value) => handleSelectChange("tax_preference", value)}
          >
            <SelectTrigger className="w-full rounded-xl px-4 py-3 text-base border border-gray-300">
              <SelectValue placeholder="Select tax preference" />
            </SelectTrigger>
            <SelectContent>
              {taxPreferenceOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {customerData.tax_preference === "Tax Exempt" && (
        <div className="space-y-2">
          <Label htmlFor="exemption_reason">Tax Exemption Reason</Label>
          <Input
            id="exemption_reason"
            name="exemption_reason"
            value={customerData.exemption_reason}
            onChange={handleInputChange}
            required
            className="rounded-xl px-4 py-3 text-base border border-gray-300"
          />
        </div>
      )}
    </div>
  );
};

export default OtherDetails;
