import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CompanyDetails = ({ customerData, handleInputChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="companyName">Company Name</Label>
        <Input
          id="companyName"
          name="companyName"
          type="text"
          value={customerData.companyName}
          onChange={handleInputChange}
          required
          className="text-base py-3 px-4 rounded-xl border border-gray-300"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="displayName">Customer Display Name</Label>
        <Input
          id="displayName"
          name="displayName"
          type="text"
          value={customerData.displayName}
          onChange={handleInputChange}
          required
          className="text-base py-3 px-4 rounded-xl border border-gray-300"
        />
      </div>
    </div>
  );
};

export default CompanyDetails;
