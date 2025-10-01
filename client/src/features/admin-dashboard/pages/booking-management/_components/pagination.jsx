import useLocalization from "@/context/localization-provider/localization-context";

export default function Pagination({
  currentPage,
  totalPages,
  handlePageChange,
  ITEMS_PER_PAGE,
  bookingsData,
}) {
  const { t, lng } = useLocalization();

  const formatNumber = (num) => {
    return new Intl.NumberFormat(`${lng}-EG`).format(num);
  };

  // تحديد اتجاه الأسهم حسب اللغة
  const isRTL = lng === "ar";

  return (
    <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
      {/* Mobile Pagination */}
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100"
        >
          {isRTL ? <i className="fa-solid fa-chevron-right ms-2"></i> : null}
          {t("previous")}
          {!isRTL ? <i className="fa-solid fa-chevron-left ms-2"></i> : null}
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative ms-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100"
        >
          {isRTL ? <i className="fa-solid fa-chevron-left me-2"></i> : null}
          {t("next")}
          {!isRTL ? <i className="fa-solid fa-chevron-right ms-2"></i> : null}
        </button>
      </div>

      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        {/* Number of results */}
        <div>
          <p className="text-sm text-gray-700">
            {t("showing")}{" "}
            <span className="font-medium">
              {formatNumber(
                Math.min(
                  (currentPage - 1) * ITEMS_PER_PAGE + 1,
                  bookingsData?.data?.total || 0,
                ),
              )}
            </span>{" "}
            {t("to")}{" "}
            <span className="font-medium">
              {formatNumber(
                Math.min(currentPage * ITEMS_PER_PAGE, bookingsData?.data?.total || 0),
              )}
            </span>{" "}
            {t("of")}{" "}
            <span className="font-medium">
              {formatNumber(bookingsData?.data?.total || 0)}
            </span>{" "}
            {t("results")}
          </p>
        </div>

        <div>
          <nav
            className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            {/* زر السابق */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-s-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100"
            >
              <span className="sr-only">{t("previous")}</span>
              {isRTL ? (
                <i className="fa-solid fa-chevron-right"></i>
              ) : (
                <i className="fa-solid fa-chevron-left"></i>
              )}
            </button>

            {/* أرقام الصفحات */}
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`relative inline-flex items-center border px-4 py-2 text-sm font-medium ${
                  currentPage === index + 1
                    ? "bg-main border-main z-10 text-white"
                    : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                {formatNumber(index + 1)}
              </button>
            ))}

            {/* زر التالي */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center rounded-e-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100"
            >
              <span className="sr-only">{t("next")}</span>
              {isRTL ? (
                <i className="fa-solid fa-chevron-left"></i>
              ) : (
                <i className="fa-solid fa-chevron-right"></i>
              )}
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
