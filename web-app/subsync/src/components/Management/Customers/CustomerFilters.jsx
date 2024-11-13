import React from 'react';
import { InputGroup, Form, Button } from 'react-bootstrap';
import { Search, ChevronUp, ChevronDown } from 'lucide-react';

export default function CustomerFilters({ filterBy, setFilterBy, search, setSearch, handleSearch, sortBy, setSortBy, order, setOrder, headers }) {
  return (
    <InputGroup className="w-full md:w-auto">
      <InputGroup.Text className="bg-white border-r-0">
        <Search className="h-5 w-5 text-gray-400" />
      </InputGroup.Text>
      <Form.Control
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyPress={handleSearch}
        className="border-l-0 focus:ring-indigo-500 focus:border-indigo-500"
      />
      <Form.Select
        value={filterBy}
        onChange={(e) => setFilterBy(e.target.value)}
        className="w-auto border-l-0"
      >
        {headers.map(header => (
          <option key={header.key} value={header.label}>{header.label}</option>
        ))}
      </Form.Select>
      <Form.Select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="w-auto"
      >
        {headers.map(header => (
          <option key={header.key} value={header.label}>{header.label}</option>
        ))}
      </Form.Select>
      <Button
        variant="primary"
        onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
        className="flex items-center gap-1"
      >
        {order === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>
    </InputGroup>
  );
}
