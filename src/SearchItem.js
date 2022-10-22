import React from "react";

const SearchItem = ({ searchContent, setSearchContent }) => {
  return (
    <form className="searchForm" onSubmit={(e) => e.preventDefault()}>
      <label htmlFor="search">Search</label>
      <input
        id="search"
        type="text"
        role="searchbox"
        placeholder="Search Items"
        value={searchContent}
        onChange={(e) => setSearchContent(e.target.value)}
      />
    </form>
  )
}

export default SearchItem;