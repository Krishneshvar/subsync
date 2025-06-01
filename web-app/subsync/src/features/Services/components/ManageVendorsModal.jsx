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
import { Input } from "@/components/ui/input";

import { createVendor, updateVendor, deleteVendor } from '@/features/Services/vendorSlice';

const ManageVendorsModal = ({ onVendorsUpdated }) => {
  const dispatch = useDispatch();
  const { list: vendors, loading, error } = useSelector((state) => state.vendors);

  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [newVendor, setNewVendor] = useState({ vendor_name: '' });
  const [editingVendor, setEditingVendor] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => {
    if (!isManageModalOpen) {
      setNewVendor({ vendor_name: '' });
      setEditingVendor(null);
      setIsAddingNew(false);
    }
  }, [isManageModalOpen]);

  const handleAddVendor = async () => {
    if (!newVendor.vendor_name.trim()) {
      toast.error('Please enter a vendor name.');
      return;
    }

    if (vendors.some(v => v.vendor_name.toLowerCase() === newVendor.vendor_name.trim().toLowerCase())) {
      toast.error('A vendor with this name already exists.');
      return;
    }

    try {
      await dispatch(createVendor({ vendor_name: newVendor.vendor_name.trim() })).unwrap();
      setNewVendor({ vendor_name: '' });
      setIsAddingNew(false);
      onVendorsUpdated();
    } catch (err) {
      console.error('Error adding vendor from modal:', err);
    }
  };

  const handleUpdateVendor = async (vendorId) => {
    if (!editingVendor.vendor_name.trim()) {
      toast.error('Please enter a vendor name.');
      return;
    }

    if (vendors.some(v =>
        v.vendor_name.toLowerCase() === editingVendor.vendor_name.trim().toLowerCase() &&
        v.vendor_id !== parseInt(vendorId)
    )) {
        toast.error('Another vendor with this name already exists.');
        return;
    }

    try {
      await dispatch(updateVendor({ id: vendorId, vendor_name: editingVendor.vendor_name.trim() })).unwrap();
      setEditingVendor(null);
      onVendorsUpdated();
    } catch (err) {
      console.error('Error updating vendor from modal:', err);
    }
  };

  const handleDeleteVendor = async (vendorId) => {
    try {
      await dispatch(deleteVendor(vendorId)).unwrap();
      onVendorsUpdated();
    } catch (err) {
      console.error('Error deleting vendor from modal:', err);
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
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setIsAddingNew(true);
              setEditingVendor(null);
            }}
            disabled={loading}
          >
            + Add New Vendor
          </Button>

          {isAddingNew && (
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <Input
                value={newVendor.vendor_name}
                onChange={(e) => setNewVendor({ ...newVendor, vendor_name: e.target.value })}
                placeholder="Vendor name"
                className="flex-1"
                disabled={loading}
              />
              <Button onClick={handleAddVendor} disabled={loading}>Save</Button>
              <Button variant="outline" onClick={() => {
                setIsAddingNew(false);
                setNewVendor({ vendor_name: '' });
              }} disabled={loading}>Cancel</Button>
            </div>
          )}

          <div className="max-h-[400px] overflow-y-auto space-y-4">
            {loading && <p className="text-center text-gray-500">Loading vendors...</p>}
            {error && <p className="text-center text-red-500">Error: {error.message || String(error)}</p>}
            {!loading && !error && vendors.length === 0 && !isAddingNew ? (
              <p className="text-center text-gray-500">No vendors found. Add one!</p>
            ) : (
              vendors.map((vendor) => (
                <div key={vendor.vendor_id} className="flex items-center gap-4 p-4 border rounded-lg">
                  {editingVendor?.vendor_id === vendor.vendor_id ? (
                    <>
                      <Input
                        value={editingVendor.vendor_name}
                        onChange={(e) => setEditingVendor({ ...editingVendor, vendor_name: e.target.value })}
                        className="flex-1"
                        disabled={loading}
                      />
                      <Button onClick={() => handleUpdateVendor(vendor.vendor_id)} disabled={loading}>Save</Button>
                      <Button variant="outline" onClick={() => setEditingVendor(null)} disabled={loading}>Cancel</Button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1">{vendor.vendor_name}</span>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditingVendor(vendor);
                          setIsAddingNew(false);
                        }}
                        disabled={loading}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteVendor(vendor.vendor_id)}
                        disabled={loading}
                      >
                        Delete
                      </Button>
                    </>
                  )}
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
