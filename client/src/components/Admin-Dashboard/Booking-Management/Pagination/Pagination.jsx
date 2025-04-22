import React from "react";

export default function Pagination({
    currentPage,
    totalPages,
    handlePageChange,
    ITEMS_PER_PAGE,
    bookingsData,
}) {
    return (
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            {/*  Mobile Pagination */}
            <div className="flex-1 flex justify-between sm:hidden">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md
                                text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                    Previous
                </button>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium
            rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                    Next
                </button>
            </div>

            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                {/* Number of results */}
                <div>
                    <p className="text-sm text-gray-700">
                        Showing
                        <span className="font-medium">
                            {Math.min(
                                (currentPage - 1) * ITEMS_PER_PAGE + 1,
                                bookingsData?.data?.total || 0
                            )}
                        </span>
                        to
                        <span className="font-medium">
                            {Math.min(
                                currentPage * ITEMS_PER_PAGE,
                                bookingsData?.data?.total || 0
                            )}
                        </span>
                        of
                        <span className="font-medium">
                            {bookingsData?.data?.total || 0}
                        </span>
                        results
                    </p>
                </div>

                <div>
                    <nav
                        className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                        aria-label="Pagination"
                    >
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                            <span className="sr-only">Previous</span>
                            <i className="fa-solid fa-chevron-left"></i>
                        </button>
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => handlePageChange(index + 1)}
                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === index + 1
                                        ? "z-10 bg-main border-main text-white"
                                        : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                    }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white
                    text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                            <span className="sr-only">Next</span>
                            <i className="fa-solid fa-chevron-right"></i>
                        </button>
                    </nav>
                </div>
            </div>
            
        </div>
    );
}
