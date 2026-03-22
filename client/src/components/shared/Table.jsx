import { memo } from "react"
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md"

const Table = memo(({ headers, data, pagination, setPage, renderRow }) => {
  return (
    <div id="table-holder">
      <table>
        <thead>
          <tr>
            {headers && headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data && data.map((item, index) => renderRow(item, index))}
        </tbody>
      </table>

      {pagination && (
        <div id="pagination">
          <div className="pagination-info">
            Page <span>{pagination.currentPage}</span> of <span>{pagination.totalPages}</span>
          </div>
          
          <div className="pagination-controls">
            <button
              disabled={!pagination.hasPrevPage}
              onClick={() => setPage(prev => ({ ...prev, page: pagination.currentPage - 1 }))}
            >
              <MdKeyboardArrowLeft size={18} /> Prev
            </button>
            <button
              disabled={!pagination.hasNextPage}
              onClick={() => setPage(prev => ({ ...prev, page: pagination.currentPage + 1 }))}
            >
              Next <MdKeyboardArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
})

export default Table