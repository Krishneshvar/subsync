// src/components/ManageItemGroupsModal.jsx
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Settings2 } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { createItemGroup, updateItemGroup, deleteItemGroup } from '@/features/Services/itemGroupSlice'; // Adjust path based on your Redux store setup

const ManageItemGroupsModal = ({ onItemGroupsUpdated }) => {
  const dispatch = useDispatch();
  const { list: itemGroups, loading, error } = useSelector((state) => state.itemGroups);

  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [newItemGroup, setNewItemGroup] = useState({ item_group_name: '' });
  const [editingItemGroup, setEditingItemGroup] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => {
    if (!isManageModalOpen) {
      setNewItemGroup({ item_group_name: '' });
      setEditingItemGroup(null);
      setIsAddingNew(false);
    }
  }, [isManageModalOpen]);

  const handleAddItemGroup = async () => {
    if (!newItemGroup.item_group_name.trim()) {
      toast.error('Please enter an item group name.');
      return;
    }

    if (itemGroups.some(g => g.item_group_name.toLowerCase() === newItemGroup.item_group_name.trim().toLowerCase())) {
      toast.error('An item group with this name already exists.');
      return;
    }

    try {
      await dispatch(createItemGroup({ item_group_name: newItemGroup.item_group_name.trim() })).unwrap();
      setNewItemGroup({ item_group_name: '' });
      setIsAddingNew(false);
      onItemGroupsUpdated();
    } catch (err) {
      console.error('Error adding item group from modal:', err);
    }
  };

  const handleUpdateItemGroup = async (itemGroupId) => {
    if (!editingItemGroup.item_group_name.trim()) {
      toast.error('Please enter an item group name.');
      return;
    }

    if (itemGroups.some(g =>
        g.item_group_name.toLowerCase() === editingItemGroup.item_group_name.trim().toLowerCase() &&
        g.item_group_id !== parseInt(itemGroupId)
    )) {
        toast.error('Another item group with this name already exists.');
        return;
    }

    try {
      await dispatch(updateItemGroup({ id: itemGroupId, item_group_name: editingItemGroup.item_group_name.trim() })).unwrap();
      setEditingItemGroup(null);
      onItemGroupsUpdated();
    } catch (err) {
      console.error('Error updating item group from modal:', err);
    }
  };

  const handleDeleteItemGroup = async (itemGroupId) => {
    try {
      await dispatch(deleteItemGroup(itemGroupId)).unwrap();
      onItemGroupsUpdated();
    } catch (err) {
      console.error('Error deleting item group from modal:', err);
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
          <DialogTitle>Manage Item Groups</DialogTitle>
          <DialogDescription>
            Add, edit, or delete item groups.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setIsAddingNew(true);
              setEditingItemGroup(null);
            }}
            disabled={loading}
          >
            + Add New Item Group
          </Button>

          {isAddingNew && (
            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <Input
                value={newItemGroup.item_group_name}
                onChange={(e) => setNewItemGroup({ ...newItemGroup, item_group_name: e.target.value })}
                placeholder="Item group name"
                className="flex-1"
                disabled={loading}
              />
              <Button onClick={handleAddItemGroup} disabled={loading}>Save</Button>
              <Button variant="outline" onClick={() => {
                setIsAddingNew(false);
                setNewItemGroup({ item_group_name: '' });
              }} disabled={loading}>Cancel</Button>
            </div>
          )}

          <div className="max-h-[400px] overflow-y-auto space-y-4">
            {loading && <p className="text-center text-gray-500">Loading item groups...</p>}
            {error && <p className="text-center text-red-500">Error: {error.message || String(error)}</p>}
            {!loading && !error && itemGroups.length === 0 && !isAddingNew ? (
              <p className="text-center text-gray-500">No item groups found. Add one!</p>
            ) : (
              itemGroups.map((itemGroup) => (
                <div key={itemGroup.item_group_id} className="flex items-center gap-4 p-4 border rounded-lg">
                  {editingItemGroup?.item_group_id === itemGroup.item_group_id ? (
                    <>
                      <Input
                        value={editingItemGroup.item_group_name}
                        onChange={(e) => setEditingItemGroup({ ...editingItemGroup, item_group_name: e.target.value })}
                        className="flex-1"
                        disabled={loading}
                      />
                      <Button onClick={() => handleUpdateItemGroup(itemGroup.item_group_id)} disabled={loading}>Save</Button>
                      <Button variant="outline" onClick={() => setEditingItemGroup(null)} disabled={loading}>Cancel</Button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1">{itemGroup.item_group_name}</span>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setEditingItemGroup(itemGroup);
                          setIsAddingNew(false);
                        }}
                        disabled={loading}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteItemGroup(itemGroup.item_group_id)}
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

export default ManageItemGroupsModal;
