import { useState } from "react";
import PropTypes from "prop-types";
import "./table.css";

const ROWS_PER_PAGE = 12;

const Table = ({ columns, data }) => {
  const [page, setPage] = useState(1);

  const startIndex = (page - 1) * ROWS_PER_PAGE;
  const paginatedData = data.slice(startIndex, startIndex + ROWS_PER_PAGE);

  const totalPages = Math.ceil(data.length / ROWS_PER_PAGE);

  return (
    <>
      <table className="custom-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((row) => (
              <tr key={columns.map((col) => row[col.key]).join("-")}>
                {columns.map((col) => (
                  <td key={col.key}>{row[col.key]}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="no-data">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="pagination">
          <span className="count items">
            Showing {startIndex + 1}-
            {Math.min(startIndex + ROWS_PER_PAGE, data.length)} of {data.length}
          </span>

          <div className="pagination-center">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
            >
              Prev
            </button>

            <span className="pagination-count">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,

  data: PropTypes.arrayOf(
    PropTypes.object // flexible object rows
  ).isRequired,
};

export default Table;
