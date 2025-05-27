import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const RemarksSection = ({ customerData, handleInputChange }) => {
  return (
    <div className="space-y-2 mb-4">
      <Label htmlFor="notes">Notes</Label>
      <Textarea
        id="notes"
        name="notes"
        rows={4}
        value={customerData.notes}
        onChange={handleInputChange}
        className="rounded-xl px-4 py-3 text-base border border-gray-300"
      />
    </div>
  );
};

export default RemarksSection;
