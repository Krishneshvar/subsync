import React, { useState } from 'react';

const ParentComponent = () => {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [order, setOrder] = useState('');
  const headers = ['Header1', 'Header2', 'Header3'];

  const handleSearch = (e) => {
    const value = e.target.value;
    if (value === "") {
      // Handle empty search value
      console.log("Handling empty search value");
      // Perform any necessary actions for empty search
    } else {
      // Handle non-empty search value
      console.log("Handling search value:", value);
      // Perform search actions
    }
  };

  return (
    <div>
      <SearchFilterForm
        search={search}
        setSearch={setSearch}
        handleSearch={handleSearch}
        sortBy={sortBy}
        setSortBy={setSortBy}
        order={order}
        setOrder={setOrder}
        headers={headers}
      />
    </div>
  );
};

const SearchFilterForm = ({ search, setSearch, handleSearch, sortBy, setSortBy, order, setOrder, headers }) => {
  return (
    <form>
      <input type="text" value={search} onChange={handleSearch} />
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        {headers.map((header) => (
          <option key={header} value={header}>
            {header}
          </option>
        ))}
      </select>
      <select value={order} onChange={(e) => setOrder(e.target.value)}>
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </form>
  );
};

export default ParentComponent;
