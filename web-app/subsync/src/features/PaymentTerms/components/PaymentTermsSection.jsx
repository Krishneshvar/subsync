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
  const { data: paymentTerms = [], isLoading, isError, error, refetch } = useGetPaymentTermsQuery();
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
    if (!selectedTerm && paymentTerms.length > 0) {
      const defaultTerm = paymentTerms.find(term => term.isDefault) || paymentTerms[0];
      if (defaultTerm) {
        onTermChange({
          termId: defaultTerm.termId,
          termName: defaultTerm.termName,
          days: Number(defaultTerm.days),
          isDefault: defaultTerm.isDefault,
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
    if (term.termName.toLowerCase() === 'due on receipt') {
      daysValue = 0;
      term.days = 0;
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
        termName: newTerm.termName.trim(),
        days: newTerm.termName.toLowerCase() === 'due on receipt' ? 0 : Number(newTerm.days)
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
        termId: editingTerm.termId,
        termName: editingTerm.termName.trim(),
        days: editingTerm.termName.toLowerCase() === 'due on receipt' ? 0 : Number(editingTerm.days)
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
      await deletePaymentTerm(termToDelete.termId).unwrap();
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
    const term = paymentTerms.find(t => t.termName === value);
    if (term) {
      onTermChange({
        termId: term.termId,
        termName: term.termName,
        days: Number(term.days),
        isDefault: term.isDefault
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
              value={selectedTerm?.termName || ''}
              onValueChange={handleTermSelection}
              disabled={isLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select payment term" />
              </SelectTrigger>
              <SelectContent>
                {isLoading ? (
                  <SelectItem value="loading" disabled>Loading terms...</SelectItem>
                ) : paymentTerms.length === 0 ? (
                  <SelectItem value="no-terms" disabled>No terms available</SelectItem>
                ) : (
                  paymentTerms.map((term) => (
                    <SelectItem key={term.termId} value={term.termName}>
                      {term.termName} ({term.days || 0} days)
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
                            if (newName.toLowerCase() === 'due on receipt') {
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
                          setNewTermErrors((prev) => ({ ...prev, days: '' })); // Clear error on change
                        }}
                        placeholder="Days"
                        className={cn("w-24", newTermErrors.days && "border-red-500")}
                        disabled={newTerm.termName.toLowerCase() === 'due on receipt'}
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
                    {paymentTerms.map((term) => (
                      <div key={term.termId} className="flex items-center gap-4 p-4 border rounded-lg">
                        {editingTerm?.termId === term.termId ? (
                          <>
                            <div className="flex-1 flex flex-col gap-1">
                              <Label htmlFor={`edit-term-name-${term.termId}`} className="sr-only">Term name</Label>
                              <Input
                                id={`edit-term-name-${term.termId}`}
                                value={editingTerm.termName}
                                onChange={(e) => {
                                    const newName = e.target.value;
                                    let newDays = editingTerm.days;
                                    if (newName.toLowerCase() === 'due on receipt') {
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
                              <Label htmlFor={`edit-term-days-${term.termId}`} className="sr-only">Days</Label>
                              <Input
                                id={`edit-term-days-${term.termId}`}
                                type="number"
                                value={editingTerm.days}
                                onChange={(e) => {
                                  setEditingTerm({ ...editingTerm, days: e.target.value });
                                  setEditingTermErrors((prev) => ({ ...prev, days: '' }));
                                }}
                                placeholder="Days"
                                className={cn("w-24", editingTermErrors.days && "border-red-500")}
                                disabled={editingTerm.termName.toLowerCase() === 'due on receipt'}
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
                            <span className="flex-1 font-medium">{term.termName}</span>
                            <span className="w-24 text-gray-600 text-right">{term.days} days</span>
                            <Button
                              variant={term.isDefault ? "default" : "outline"}
                              onClick={() => handleSetDefault(term.termId)}
                              disabled={term.isDefault}
                            >
                              {term.isDefault ? "Default" : "Set Default"}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setEditingTerm({ ...term });
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
                                  disabled={term.isDefault}
                                >
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              {termToDelete?.termId === term.termId && (
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete the "{termToDelete.termName}" payment term.
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
