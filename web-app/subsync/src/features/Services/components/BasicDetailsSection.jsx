import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import ManageItemGroupsModal from './ManageItemGroupsModal';
import { fetchItemGroups } from "../itemGroupSlice.js";

const BasicDetailsSection = ({ formData, setFormData, serviceError }) => {
  const dispatch = useDispatch();
  const { list: itemGroups, loading: isLoadingItemGroups, error: itemGroupsError } = useSelector((state) => state.itemGroups);

  useEffect(() => {
    dispatch(fetchItemGroups());
  }, [dispatch]);

  const handleItemGroupChange = (selectedValue) => {
    setFormData({ ...formData, item_group: selectedValue });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="service_name">Name</Label>
          <Input
            id="service_name"
            value={formData.service_name}
            onChange={(e) => setFormData({ ...formData, service_name: e.target.value })}
          />
          {serviceError && serviceError.includes("service with this name already exists") && (
            <p className="text-red-500 text-sm mt-1">{serviceError}</p>
          )}
        </div>
        <div>
          <Label htmlFor="SKU">SKU (Stock Keepers Unit)</Label>
          <Input
            id="SKU"
            value={formData.SKU}
            onChange={(e) => setFormData({ ...formData, SKU: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="tax_preference">Tax Preference</Label>
          <Select
            id="tax_preference"
            onValueChange={(val) => setFormData({ ...formData, tax_preference: val })}
            defaultValue={formData.tax_preference}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Taxable">Taxable</SelectItem>
              <SelectItem value="Tax Exempt">Tax Exempt</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="item-group">Item Group</Label>
          <div className="flex gap-2">
            <Select
              value={formData.item_group || ""}
              onValueChange={handleItemGroupChange}
              disabled={isLoadingItemGroups || itemGroupsError}
              className="flex-1"
            >
              <SelectTrigger className="w-full" id="item-group">
                <SelectValue placeholder={isLoadingItemGroups ? "Loading item groups..." : itemGroupsError ? "Error loading item groups" : "Select an item group"} />
              </SelectTrigger>
              <SelectContent>
                {itemGroupsError ? (
                  <SelectItem value="error" disabled>Error loading item groups</SelectItem>
                ) : itemGroups.length === 0 && !isLoadingItemGroups ? (
                  <SelectItem value="no-item-groups" disabled>No item groups available</SelectItem>
                ) : (
                  itemGroups.map((group) => (
                    <SelectItem key={group.item_group_id} value={String(group.item_group_id)}>
                      {group.item_group_name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            <ManageItemGroupsModal onItemGroupsUpdated={() => dispatch(fetchItemGroups())} />
          </div>
          {itemGroupsError && (
            <p className="text-red-500 text-sm mt-1">Failed to load item groups. Please try again.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default BasicDetailsSection;
