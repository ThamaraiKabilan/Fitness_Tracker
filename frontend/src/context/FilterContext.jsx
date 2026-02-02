import React, { createContext, useState } from 'react';

// This creates the context
export const FilterContext = createContext();

// This provider will wrap our app and hold the date state
export const FilterProvider = ({ children }) => {
  // Default filter is set to 'Today'
  const [dateFilter, setDateFilter] = useState('Today');

  return (
    <FilterContext.Provider value={{ dateFilter, setDateFilter }}>
      {children}
    </FilterContext.Provider>
  );
};