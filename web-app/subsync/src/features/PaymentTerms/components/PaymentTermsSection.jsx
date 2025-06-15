import { Settings2 } from "lucide-react";
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { cn } from "@/lib/utils.js";

import {
  useGetPaymentTermsQuery,
  useAddPaymentTermMutation,
  useUpdatePaymentTermMutation,
  useDeletePaymentTermMutation,
  useSetDefaultPaymentTermMutation,
} from '../paymentTermsApi.js';

const PaymentTermsSection = ({ selectedTerm, onTermChange }) => {
  // Destructure data as 'paymentTermsResponse' and then safely access paymentTermsResponse.data
  const { data: paymentTermsResponse, isLoading, isError, error, refetch } = useGetPaymentTermsQuery();

  // Safely access the array of payment terms, defaulting to an empty array if not present
  const paymentTerms = paymentTermsResponse?.data || [];

  const [addPaymentTerm] = useAddPaymentTermMutation();
  const [updatePaymentTerm] = useUpdatePaymentTermMutation();
  const [deletePaymentTerm] = useDeletePaymentTermMutation();
  const [setDefaultPaymentTerm] = useSetDefaultPaymentTermMutation();

  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [newTerm, setNewTerm] = useState({ termName: '', days: '' });
  const [newTermErrors, setNewTermErrors] = useState({});
  const [editingTerm, setEditingTerm] = useState(null);
  const [editingTermErrors, setEditingTermErrors] = useState({});
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [termToDelete, setTermToDelete] = useState(null);

  useEffect(() => {
    // Only attempt to set a default if paymentTerms has loaded and is not empty, and no term is already selected
    if (!selectedTerm && paymentTerms.length > 0) {
      const defaultTerm = paymentTerms.find(term => term.is_default) || paymentTerms[0]; // Use is_default from backend
      if (defaultTerm) {
        onTermChange({
          termId: defaultTerm.term_id,    // Use term_id from backend
          termName: defaultTerm.term_name,  // Use term_name from backend
          days: Number(defaultTerm.days),
          isDefault: defaultTerm.is_default, // Use is_default from backend
        });
      }
    }
  }, [paymentTerms, selectedTerm, onTermChange]);

  useEffect(() => {
    if (isError) {
      console.error('Error fetching payment terms:', error);
      toast.error(error.data?.message || 'Failed to load payment terms');
    }
  }, [isError, error]);

  const validateTerm = (term, isNew = true) => {
    let errors = {};
    if (!term.termName.trim()) {
      errors.termName = 'Term name cannot be empty.';
    }

    let daysValue = Number(term.days);
    // Ensure "Due on Receipt" always has 0 days, regardless of user input
    if (term.termName.toLowerCase().trim() === 'due on receipt') {
      daysValue = 0;
      term.days = 0; // Update the term object directly to reflect 0 days
    } else if (isNaN(daysValue) || daysValue < 0) {
      errors.days = 'Days must be a valid non-negative number.';
    }

    if (isNew) {
      setNewTermErrors(errors);
    } else {
      setEditingTermErrors(errors);
    }
    return Object.keys(errors).length === 0;
  };

  const handleAddTerm = async () => {
    if (!validateTerm(newTerm, true)) {
      return;
    }

    try {
      const termData = {
        term_name: newTerm.termName.trim(), // Match backend key 'term_name'
        days: newTerm.termName.toLowerCase().trim() === 'due on receipt' ? 0 : Number(newTerm.days)
      };
      await addPaymentTerm(termData).unwrap();
      setNewTerm({ termName: '', days: '' });
      setIsAddingNew(false);
      setNewTermErrors({});
      toast.success('Payment term added successfully');
    } catch (err) {
      console.error('Failed to add payment term:', err);
      toast.error(err.data?.message || 'Failed to add payment term');
    }
  };

  const handleUpdateTerm = async () => {
    if (!editingTerm || !validateTerm(editingTerm, false)) {
      return;
    }

    try {
      const termData = {
        term_id: editingTerm.termId,      // Match backend key 'term_id'
        term_name: editingTerm.termName.trim(), // Match backend key 'term_name'
        days: editingTerm.termName.toLowerCase().trim() === 'due on receipt' ? 0 : Number(editingTerm.days)
      };
      await updatePaymentTerm(termData).unwrap();
      setEditingTerm(null);
      setEditingTermErrors({});
      toast.success('Payment term updated successfully');
    } catch (err) {
      console.error('Failed to update payment term:', err);
      toast.error(err.data?.message || 'Failed to update payment term');
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!termToDelete) return;
    try {
      await deletePaymentTerm(termToDelete.term_id).unwrap(); // Use term_id
      toast.success('Payment term deleted successfully');
      setTermToDelete(null);
    } catch (err) {
      console.error('Failed to delete payment term:', err);
      toast.error(err.data?.message || 'Failed to delete payment term');
    }
  };

  const handleSetDefault = async (termId) => {
    try {
      await setDefaultPaymentTerm(termId).unwrap();
      toast.success('Default payment term updated');
    } catch (err) {
      console.error('Failed to set default payment term:', err);
      toast.error(err.data?.message || 'Failed to set default payment term');
    }
  };

  const handleTermSelection = (value) => {
    // Find the term by its name, then update selectedTerm
    const term = paymentTerms.find(t => t.term_name === value); // Use term_name for finding
    if (term) {
      onTermChange({
        termId: term.term_id,
        termName: term.term_name,
        days: Number(term.days),
        isDefault: term.is_default
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Label htmlFor="payment-terms">Payment Terms</Label>
          <div className="flex gap-2 mt-1">
            <Select
              value={selectedTerm?.termName || ''} // Use selectedTerm.termName for value
              onValueChange={handleTermSelection}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select payment term" />
              </SelectTrigger>
              <SelectContent>
                {isLoading ? (
                  <SelectItem key="loading-terms" value="loading" disabled>Loading terms...</SelectItem>
                ) : paymentTerms.length === 0 ? (
                  <SelectItem key="no-terms-available" value="no-terms" disabled>No terms available</SelectItem>
                ) : (
                  // Map directly over the 'paymentTerms' array
                  paymentTerms.map((term) => (
                    <SelectItem key={term.term_id} value={term.term_name}>
                      {term.term_name} ({term.days || 0} days)
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            <Dialog open={isManageModalOpen} onOpenChange={setIsManageModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Manage Payment Terms</DialogTitle>
                  <DialogDescription>
                    Configure your payment terms and set defaults.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <Button
                    variant="outline"
                    className="w-full bg-blue-500 text-white hover:bg-blue-600"
                    onClick={() => {
                      setIsAddingNew(true);
                      setNewTerm({ termName: '', days: '' });
                      setNewTermErrors({});
                      setEditingTerm(null);
                      setEditingTermErrors({});
                    }}
                  >
                    + Add New Payment Term
                  </Button>

                  {isAddingNew && (
                    <div className="flex flex-col gap-2 p-4 border rounded-lg">
                      <Label htmlFor="new-term-name">Term name</Label>
                      <Input
                        id="new-term-name"
                        value={newTerm.termName}
                        onChange={(e) => {
                          const newName = e.target.value;
                          let newDays = newTerm.days;
                          // Automatically set days to 0 if "Due on Receipt" is entered
                          if (newName.toLowerCase().trim() === 'due on receipt') {
                            newDays = 0;
                          }
                          setNewTerm({ ...newTerm, termName: newName, days: newDays });
                          setNewTermErrors((prev) => ({ ...prev, termName: '' }));
                        }}
                        placeholder="Term name"
                        className={cn(newTermErrors.termName && "border-red-500")}
                      />
                      {newTermErrors.termName && (
                        <p className="text-red-500 text-sm">{newTermErrors.termName}</p>
                      )}

                      <Label htmlFor="new-term-days">Days</Label>
                      <Input
                        id="new-term-days"
                        type="number"
                        value={newTerm.days}
                        onChange={(e) => {
                          setNewTerm({ ...newTerm, days: e.target.value });
                          setNewTermErrors((prev) => ({ ...prev, days: '' }));
                        }}
                        placeholder="Days"
                        className={cn("w-24", newTermErrors.days && "border-red-500")}
                        disabled={newTerm.termName.toLowerCase().trim() === 'due on receipt'} // Disable if "Due on Receipt"
                      />
                      {newTermErrors.days && (
                        <p className="text-red-500 text-sm">{newTermErrors.days}</p>
                      )}

                      <div className="flex gap-2 mt-2">
                        <Button onClick={handleAddTerm}>Save</Button>
                        <Button variant="outline" onClick={() => {
                          setIsAddingNew(false);
                          setNewTerm({ termName: '', days: '' });
                          setNewTermErrors({});
                        }}>Cancel</Button>
                      </div>
                    </div>
                  )}

                  <div className="max-h-[400px] overflow-y-auto space-y-4">
                    {/* Ensure paymentTerms is an array before mapping */}
                    {paymentTerms.map((term) => (
                      <div key={term.term_id} className="flex items-center gap-4 p-4 border rounded-lg">
                        {editingTerm?.termId === term.term_id ? (
                          <>
                            <div className="flex-1 flex flex-col gap-1">
                              <Label htmlFor={`edit-term-name-${term.term_id}`} className="sr-only">Term name</Label>
                              <Input
                                id={`edit-term-name-${term.term_id}`}
                                value={editingTerm.termName}
                                onChange={(e) => {
                                  const newName = e.target.value;
                                  let newDays = editingTerm.days;
                                  if (newName.toLowerCase().trim() === 'due on receipt') {
                                    newDays = 0;
                                  }
                                  setEditingTerm({ ...editingTerm, termName: newName, days: newDays });
                                  setEditingTermErrors((prev) => ({ ...prev, termName: '' }));
                                }}
                                className={cn("flex-1", editingTermErrors.termName && "border-red-500")}
                              />
                              {editingTermErrors.termName && (
                                <p className="text-red-500 text-sm">{editingTermErrors.termName}</p>
                              )}
                            </div>
                            <div className="flex flex-col gap-1">
                              <Label htmlFor={`edit-term-days-${term.term_id}`} className="sr-only">Days</Label>
                              <Input
                                id={`edit-term-days-${term.term_id}`}
                                type="number"
                                value={editingTerm.days}
                                onChange={(e) => {
                                  setEditingTerm({ ...editingTerm, days: e.target.value });
                                  setEditingTermErrors((prev) => ({ ...prev, days: '' }));
                                }}
                                placeholder="Days"
                                className={cn("w-24", editingTermErrors.days && "border-red-500")}
                                disabled={editingTerm.termName.toLowerCase().trim() === 'due on receipt'}
                              />
                              {editingTermErrors.days && (
                                <p className="text-red-500 text-sm">{editingTermErrors.days}</p>
                              )}
                            </div>
                            <Button onClick={handleUpdateTerm}>Save</Button>
                            <Button variant="outline" onClick={() => {
                              setEditingTerm(null);
                              setEditingTermErrors({});
                            }}>Cancel</Button>
                          </>
                        ) : (
                          <>
                            <span className="flex-1 font-medium">{term.term_name}</span>
                            <span className="w-24 text-gray-600 text-right">{term.days} days</span>
                            <Button
                              variant={term.is_default ? "default" : "outline"} // Use is_default
                              onClick={() => handleSetDefault(term.term_id)} // Use term_id
                              disabled={term.is_default} // Use is_default
                            >
                              {term.is_default ? "Default" : "Set Default"}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                // Set editingTerm with current term's properties (using camelCase for frontend state)
                                setEditingTerm({
                                  termId: term.term_id,
                                  termName: term.term_name,
                                  days: term.days,
                                  isDefault: term.is_default,
                                });
                                setIsAddingNew(false);
                                setNewTermErrors({});
                              }}
                            >
                              Edit
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="destructive"
                                  onClick={() => setTermToDelete(term)}
                                  disabled={term.is_default}
                                >
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              {termToDelete?.term_id === term.term_id && (
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete the "{termToDelete?.term_name}" payment term.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel onClick={() => setTermToDelete(null)}>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDeleteConfirmed}>Continue</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              )}
                            </AlertDialog>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentTermsSection;
