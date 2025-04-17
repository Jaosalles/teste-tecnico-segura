import { PaginationProps } from "../types";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  loading,
}: PaginationProps) => {
  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1 || loading}
      >
        Anterior
      </button>

      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          onClick={() => onPageChange(i + 1)}
          className={currentPage === i + 1 ? "active" : ""}
          disabled={loading}
        >
          {i + 1}
        </button>
      ))}

      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages || loading}
      >
        Próxima
      </button>
    </div>
  );
};

export default Pagination;
