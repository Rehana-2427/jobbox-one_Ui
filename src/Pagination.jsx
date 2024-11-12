// src/components/Pagination.js
import React from 'react';
import ReactPaginate from 'react-paginate';

const Pagination = ({
  page,
  pageSize,
  totalPages,
  handlePageSizeChange,
  isPageSizeDisabled,
  handlePageClick
}) => {
  // Determine if forcePage should be used
  const isPageValid = page >= 0 && page < totalPages;
  const forcePage = isPageValid ? page : totalPages > 0 ? totalPages - 1 : undefined;

  return (
    <div className="pagination-container d-flex justify-content-end align-items-center">
      <div className="page-size-select me-3">
        <label htmlFor="pageSize">Page Size:</label>
        <select
          id="pageSize"
          onChange={handlePageSizeChange}
          value={pageSize}
          disabled={isPageSizeDisabled}
        >
          <option value="6">6</option>
          <option value="12">12</option>
          <option value="18">18</option>
        </select>
      </div>
      <ReactPaginate
        previousLabel={<i className="i-Previous" />}
        nextLabel={<i className="i-Next1" />}
        breakLabel="..."
        breakClassName="break-me"
        pageCount={totalPages}
        marginPagesDisplayed={1}
        pageRangeDisplayed={2}
        onPageChange={handlePageClick}
        activeClassName="active"
        containerClassName="pagination"
        subContainerClassName="pages pagination"
        forcePage={forcePage} // Apply forcePage based on validity
      />
    </div>
  );
};

export default Pagination;
