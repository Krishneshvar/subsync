import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SalesInfoSection = ({ data, setData }) => (
  <div className="space-y-2">
    <h2 className="text-lg font-semibold">Sales Information</h2>
    <div>
      <Label>Selling Price</Label>
      <Input type="number" value={data.price} onChange={(e) => setData({ ...data, price: e.target.value })} />
    </div>
    
    <div>
      <Label>Description</Label>
      <Input value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} />
    </div>
  </div>
)

export default SalesInfoSection
