import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils.js";

const CompanyDetails = ({ customerData, handleInputChange, errors = {} }) => {
  const hasCompanyNameError = errors.companyName;
  const hasDisplayNameError = errors.displayName;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="companyName">Company Name</Label>
        <Input
          id="companyName"
          name="companyName"
          type="text"
          value={customerData.companyName || ""}
          onChange={handleInputChange}
          className={cn(
            "text-base py-3 px-4 rounded-xl border border-gray-300",
            hasCompanyNameError && "border-red-500 focus-visible:ring-red-500"
          )}
          aria-invalid={hasCompanyNameError ? "true" : undefined}
          aria-describedby={hasCompanyNameError ? "companyName-error" : undefined}
        />
        {hasCompanyNameError && (
          <p id="companyName-error" className="text-red-500 text-sm mt-1">{hasCompanyNameError}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="displayName">Customer Display Name</Label>
        <Input
          id="displayName"
          name="displayName"
          type="text"
          value={customerData.displayName || ""}
          onChange={handleInputChange}
          className={cn(
            "text-base py-3 px-4 rounded-xl border border-gray-300",
            hasDisplayNameError && "border-red-500 focus-visible:ring-red-500"
          )}
          aria-invalid={hasDisplayNameError ? "true" : undefined}
          aria-describedby={hasDisplayNameError ? "displayName-error" : undefined}
        />
        {hasDisplayNameError && (
          <p id="displayName-error" className="text-red-500 text-sm mt-1">{hasDisplayNameError}</p>
        )}
      </div>
    </div>
  );
};

export default CompanyDetails;
