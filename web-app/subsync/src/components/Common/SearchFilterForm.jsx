import React from 'react'
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const SelectInput = ({ value, onChange, options, placeholder }) => (
  <div className="w-full md:w-auto">
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="min-w-52">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map(opt => (
          <SelectItem key={opt.key || opt.label} value={opt.key || opt.label}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

export default function SearchFilterForm({
  filterBy,
  setFilterBy,
  search,
  setSearch,
  sortBy,
  setSortBy,
  order,
  setOrder,
  headers,
  onSearch
}) {
  return (
    <div className="w-full md:w-auto flex flex-wrap items-center gap-2 mb-6">
      <SelectInput label="Filter By" value={filterBy} onChange={setFilterBy} options={headers} placeholder="Filter by" />
      <Input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} onKeyPress={onSearch} className="w-full md:w-auto" />
      <SelectInput label="Sort By" value={sortBy} onChange={setSortBy} options={headers} placeholder="Sort by" />
      <SelectInput label="Order" value={order} onChange={setOrder} options={[{ label: 'Ascending', key: 'asc' }, { label: 'Descending', key: 'desc' }]} placeholder="Order" />
    </div>
  );
}
