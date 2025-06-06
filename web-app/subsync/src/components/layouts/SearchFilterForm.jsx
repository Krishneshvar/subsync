import { Command, CommandInput } from "@/components/ui/command";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SelectInput = ({ value, onChange, options, placeholder }) => (
  <div className="w-full sm:w-auto">
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full sm:min-w-32">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.key || opt.label} value={opt.key || opt.label}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

function SearchFilterForm({ search, setSearch, handleSearch, sortBy, setSortBy, order, setOrder, headers }) {
  return (
    <div className="w-full flex flex-col sm:flex-row items-center gap-2 mb-2">
      <div className="relative w-full sm:w-auto">
        <Command className="border-b-0 border-gray-300">
          <CommandInput
            value={search}
            onValueChange={setSearch}
            placeholder="Search"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
          />
        </Command>
      </div>
      <SelectInput value={sortBy} onChange={setSortBy} options={headers} placeholder="Sort by" />
      <SelectInput
        value={order}
        onChange={setOrder}
        options={[
          { label: "Ascending", key: "asc" },
          { label: "Descending", key: "desc" },
        ]}
        placeholder="Order"
      />
    </div>
  );
}

export default SearchFilterForm;
