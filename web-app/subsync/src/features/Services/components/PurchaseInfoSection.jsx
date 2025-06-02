import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import ManageVendorsModal from './ManageVendorsModal';

const PurchaseInfoSection = ({ data, setData, vendors, isLoadingVendors, vendorsError, fetchVendors }) => {

  const handleVendorChange = (selectedValue) => {
    setData({ ...data, vendor: selectedValue });
  };

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Purchase Information</h2>
      <div>
        <Label htmlFor="cost-price">Cost Price</Label>
        <Input
          id="cost-price"
          type="number"
          value={data.price}
          onChange={(e) => setData({ ...data, price: e.target.value })}
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={data.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
        />
      </div>

      <div className="space-y-2 mt-4 pt-4 border-t border-gray-300">
        <Label htmlFor="preferred-vendor">Preferred Vendor</Label>
        <div className="flex gap-2">
          <Select
            value={data.vendor || ""}
            onValueChange={handleVendorChange}
            disabled={isLoadingVendors || vendorsError}
            className="flex-1"
          >
            <SelectTrigger className="w-full" id="preferred-vendor">
              <SelectValue placeholder={isLoadingVendors ? "Loading vendors..." : vendorsError ? "Error loading vendors" : "Select a vendor"} />
            </SelectTrigger>
            <SelectContent>
              {vendorsError ? (
                <SelectItem value="error" disabled>Error loading vendors</SelectItem>
              ) : vendors.length === 0 && !isLoadingVendors ? (
                <SelectItem value="no-vendors" disabled>No vendors available</SelectItem>
              ) : (
                vendors.map((vendor) => (
                  <SelectItem key={vendor.vendor_id} value={String(vendor.vendor_id)}>
                    {vendor.vendor_name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>

          <ManageVendorsModal onVendorsUpdated={fetchVendors} currentVendors={vendors} />
        </div>
        {vendorsError && (
          <p className="text-red-500 text-sm mt-1">Failed to load vendors. Please try again.</p>
        )}
      </div>
    </div>
  );
};

export default PurchaseInfoSection;
