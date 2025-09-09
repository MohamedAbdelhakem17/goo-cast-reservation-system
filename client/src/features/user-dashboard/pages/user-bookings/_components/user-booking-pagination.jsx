export default function Pagination({ currentPage, setCurrentPage, totalPages }) {
  return (
    <div className="mt-10 flex justify-center">
      <nav className="flex items-center gap-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="rounded-lg border p-2 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <i className="fa-solid fa-chevron-left"></i>
        </button>

        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentPage(idx + 1)}
            className={`h-10 w-10 rounded-lg border transition ${
              currentPage === idx + 1
                ? "from-main to-main/80 border-main bg-gradient-to-r text-white"
                : "hover:bg-gray-50"
            }`}
          >
            {idx + 1}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="rounded-lg border p-2 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      </nav>
    </div>
  );
}
