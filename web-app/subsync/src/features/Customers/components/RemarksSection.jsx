import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils.js";

const RemarksSection = ({ customerData, handleInputChange, errors = {} }) => {
  const hasNotesError = errors.notes;

  return (
    <div className="space-y-2 mb-4">
      <Label htmlFor="notes">Notes</Label>
      <Textarea
        id="notes"
        name="notes"
        rows={4}
        value={customerData.notes || ""}
        onChange={handleInputChange}
        className={cn(
          "rounded-xl px-4 py-3 text-base border border-gray-300",
          hasNotesError && "border-red-500 focus-visible:ring-red-500"
        )}
        aria-invalid={hasNotesError ? "true" : undefined}
        aria-describedby={hasNotesError ? "notes-error" : undefined}
      />
      {hasNotesError && (
        <p id="notes-error" className="text-red-500 text-sm mt-1">{hasNotesError}</p>
      )}
    </div>
  );
};

export default RemarksSection;
