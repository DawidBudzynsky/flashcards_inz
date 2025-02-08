import { useState } from "react";

function useFuzzySearch<T extends Record<string, any>>(
  data: T[],
  searchQuery: string,
  searchKey: string,
) {
  const [query, setQuery] = useState(searchQuery);

  const filteredData = data?.filter((item) => {
    const target = item[searchKey];
    return fuzzyMatch(query.toLowerCase(), target);
  });

  return { query, setQuery, filteredData };
}

const fuzzyMatch = (query: string, target: string) => {
  if (typeof target !== "string") {
    return false;
  }

  let queryIndex = 0;
  for (const char of target.toLowerCase()) {
    if (char === query[queryIndex]) {
      queryIndex++;
    }
    if (queryIndex === query.length) {
      return true;
    }
  }
  return false;
};

export default useFuzzySearch;
