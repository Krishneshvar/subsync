import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TaxSection = ({ taxRates, setTaxRates }) => (
  <div className="space-y-2 mt-4">
    <h2 className="text-lg font-semibold">Default Tax Rates</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label>Intra State Tax</Label>
        <Input value={taxRates.intra} onChange={(e) => setTaxRates({ ...taxRates, intra: e.target.value })} />
      </div>
      <div>
        <Label>Inter State Tax</Label>
        <Input value={taxRates.inter} onChange={(e) => setTaxRates({ ...taxRates, inter: e.target.value })} />
      </div>
    </div>
  </div>
)

export default TaxSection
