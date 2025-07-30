function PagingComponent({
  totalPages,
  currentPage,
  handleChangePage,
}: {
  totalPages: number;
  currentPage: number;
  handleChangePage: (page: number) => void;
}) {
  return (
    <div className="flex justify-center" id="BugPagination">
      {totalPages > 1 && (
        <div className="join p-4 flex justify-center">
          {(() => {
            const pages: (number | string)[] = [];

            if (totalPages <= 5) {
              // Trường hợp ít trang, hiển thị hết
              for (let i = 1; i <= totalPages; i++) pages.push(i);
            } else {
              const left = Math.max(4, currentPage - 1);
              const right = Math.min(totalPages - 3, currentPage + 1);

              pages.push(1); // Luôn có trang đầu
              pages.push(2);
              pages.push(3);
              if (left > 4) pages.push("start-ellipsis");

              for (let i = left; i <= right; i++) {
                pages.push(i);
              }

              if (right < totalPages - 3) pages.push("end-ellipsis");
              pages.push(totalPages - 2);
              pages.push(totalPages - 1);
              pages.push(totalPages); // Luôn có trang cuối
            }

            return pages.map((page, idx) => {
              if (typeof page === "string") {
                return (
                  <button
                    key={page + idx}
                    className="join-item btn btn-disabled"
                  >
                    ...
                  </button>
                );
              }

              return (
                <button
                  key={page}
                  onClick={() => handleChangePage(page)}
                  className={`join-item btn ${
                    page === currentPage ? "btn-primary" : ""
                  }`}
                >
                  {page}
                </button>
              );
            });
          })()}
        </div>
      )}
    </div>
  );
}

export default PagingComponent;
