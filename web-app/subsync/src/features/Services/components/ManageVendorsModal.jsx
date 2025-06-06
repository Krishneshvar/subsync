import { Settings2 } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { fetchVendors, deleteVendor } from '@/features/Services/vendorSlice';
import AddVendorModal from './AddVendorModal';

const ManageVendorsModal = ({ onVendorsUpdated }) => {
  const dispatch = useDispatch();
  const { list: vendors, loading, error } = useSelector((state) => state.vendors);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);

  useEffect(() => {
    if (isManageModalOpen) {
      dispatch(fetchVendors());
    }
  }, [isManageModalOpen, dispatch]);

  const handleDeleteVendor = async (vendorId) => {
    try {
      await dispatch(deleteVendor(vendorId)).unwrap();
      onVendorsUpdated();
    } catch (err) {
      console.error('Error deleting vendor:', err);
      toast.error(err.message || 'Failed to delete vendor');
    }
  };

  return (
    <Dialog open={isManageModalOpen} onOpenChange={setIsManageModalOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" disabled={loading}>
          <Settings2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage Vendors</DialogTitle>
          <DialogDescription>
            Add, edit, or delete vendors.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <AddVendorModal onVendorAdded={onVendorsUpdated} />

          <div className="max-h-[400px] overflow-y-auto space-y-4">
            {loading && <p className="text-center text-gray-500">Loading vendors...</p>}
            {error && <p className="text-center text-red-500">Error: {error.message || String(error)}</p>}
            {!loading && !error && vendors.length === 0 ? (
              <p className="text-center text-gray-500">No vendors found. Add one!</p>
            ) : (
              vendors.map((vendor) => (
                <div key={vendor.vendor_id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <span className="flex-1">{vendor.display_name}</span>
                  <AddVendorModal
                    isEditing={true}
                    editableVendor={vendor}
                    onVendorAdded={onVendorsUpdated}
                  />
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteVendor(vendor.vendor_id)}
                    disabled={loading}
                  >
                    Delete
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setIsManageModalOpen(false)} disabled={loading}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ManageVendorsModal;
