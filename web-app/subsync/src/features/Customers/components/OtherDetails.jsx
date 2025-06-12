import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { cn } from "@/lib/utils.js";

const OtherDetails = ({ customerData, handleInputChange, handleSelectChange, errors = {} }) => {
  const currencyOptions = ["INR", "USD", "EUR"];
  const gstTreatmentOptions = ["iGST", "CGST & SGST", "No GST", "Zero Tax", "SEZ"];
  const taxPreferenceOptions = ["Taxable", "Tax Exempt"];

  const currencyValue = customerData.currencyCode || "INR";
  const gstTreatmentValue = customerData.gstTreatment || "iGST";
  const taxPreferenceValue = customerData.taxPreference || "Taxable";

  const hasGstinError = errors.gstin;
  const hasCurrencyCodeError = errors.currencyCode;
  const hasGstTreatmentError = errors.gstTreatment;
  const hasTaxPreferenceError = errors.taxPreference;
  const hasExemptionReasonError = errors.exemptionReason;

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="gstin">GSTIN</Label>
          <Input
            id="gstin"
            name="gstin"
            value={customerData.gstin || ""}
            onChange={handleInputChange}
            className={cn(
              "rounded-xl px-4 py-3 text-base border border-gray-300",
              hasGstinError && "border-red-500 focus-visible:ring-red-500"
            )}
            aria-invalid={hasGstinError ? "true" : undefined}
            aria-describedby={hasGstinError ? "gstin-error" : undefined}
          />
          {hasGstinError && (
            <p id="gstin-error" className="text-red-500 text-sm mt-1">{hasGstinError}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="currencyCode">Currency Code</Label>
          <Select
            value={currencyValue}
            onValueChange={(value) => handleSelectChange("currencyCode", value)}
          >
            <SelectTrigger
              id="currencyCode"
              className={cn(
                "w-full rounded-xl px-4 py-3 text-base border border-gray-300",
                hasCurrencyCodeError && "border-red-500 focus-visible:ring-red-500"
              )}
              aria-invalid={hasCurrencyCodeError ? "true" : undefined}
              aria-describedby={hasCurrencyCodeError ? "currencyCode-error" : undefined}
            >
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {currencyOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasCurrencyCodeError && (
            <p id="currencyCode-error" className="text-red-500 text-sm mt-1">{hasCurrencyCodeError}</p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="gstTreatment">GST Treatment</Label>
          <Select
            value={gstTreatmentValue}
            onValueChange={(value) => handleSelectChange("gstTreatment", value)}
          >
            <SelectTrigger
              id="gstTreatment"
              className={cn(
                "w-full rounded-xl px-4 py-3 text-base border border-gray-300",
                hasGstTreatmentError && "border-red-500 focus-visible:ring-red-500"
              )}
              aria-invalid={hasGstTreatmentError ? "true" : undefined}
              aria-describedby={hasGstTreatmentError ? "gstTreatment-error" : undefined}
            >
              <SelectValue placeholder="Select treatment" />
            </SelectTrigger>
            <SelectContent>
              {gstTreatmentOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasGstTreatmentError && (
            <p id="gstTreatment-error" className="text-red-500 text-sm mt-1">{hasGstTreatmentError}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="taxPreference">Tax Preference</Label>
          <Select
            value={taxPreferenceValue}
            onValueChange={(value) => handleSelectChange("taxPreference", value)}
          >
            <SelectTrigger
              id="taxPreference"
              className={cn(
                "w-full rounded-xl px-4 py-3 text-base border border-gray-300",
                hasTaxPreferenceError && "border-red-500 focus-visible:ring-red-500"
              )}
              aria-invalid={hasTaxPreferenceError ? "true" : undefined}
              aria-describedby={hasTaxPreferenceError ? "taxPreference-error" : undefined}
            >
              <SelectValue placeholder="Select tax preference" />
            </SelectTrigger>
            <SelectContent>
              {taxPreferenceOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasTaxPreferenceError && (
            <p id="taxPreference-error" className="text-red-500 text-sm mt-1">{hasTaxPreferenceError}</p>
          )}
        </div>
      </div>

      {customerData.taxPreference === "Tax Exempt" && (
        <div className="space-y-2">
          <Label htmlFor="exemptionReason">Tax Exemption Reason</Label>
          <Input
            id="exemptionReason"
            name="exemptionReason"
            value={customerData.exemptionReason || ""}
            onChange={handleInputChange}
            className={cn(
              "rounded-xl px-4 py-3 text-base border border-gray-300",
              hasExemptionReasonError && "border-red-500 focus-visible:ring-red-500"
            )}
            aria-invalid={hasExemptionReasonError ? "true" : undefined}
            aria-describedby={hasExemptionReasonError ? "exemptionReason-error" : undefined}
          />
          {hasExemptionReasonError && (
            <p id="exemptionReason-error" className="text-red-500 text-sm mt-1">{hasExemptionReasonError}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default OtherDetails;
