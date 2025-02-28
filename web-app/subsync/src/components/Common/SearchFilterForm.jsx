import React from "react";
import { Command, CommandInput } from "@/components/ui/command";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SelectInput = ({ value, onChange, options, placeholder }) => (
  <div className="w-full sm:w-auto">
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full sm:min-w-32">
        {/* ✅ Allow the dropdown to be fully responsive */}
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

export default function SearchFilterForm({ search, setSearch, handleSearch, sortBy, setSortBy, order, setOrder, headers }) {
  return (
    <div className="w-full flex flex-col sm:flex-row items-center gap-2 mb-2">
      <div className="relative w-full sm:w-auto">
        <Command>
          <CommandInput
            value={search}
            onChange={setSearch}
            placeholder="Search"
            onKeyDown={handleSearch}
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
