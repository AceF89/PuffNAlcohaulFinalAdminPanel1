import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import classNames from "classnames";

interface PaginationProps {
  tableProps: {
    pageCount: number;
    pageOptions: Array<any>;
    setPageSize: (page: number) => void;
    gotoPage: (page: number) => void;
    state: {
      pageIndex: number;
      pageSize: number;
    };
  };
  sizePerPageList: {
    text: string;
    value: number;
  }[];
}

const Pagination = ({ tableProps, sizePerPageList }: PaginationProps) => {
  const location = useLocation();
  /**
   * pagination count , index
   */
  const [pageCount, setPageCount] = useState<number>(tableProps.pageCount);
  const [pageIndex, setPageIndex] = useState<number>(
    tableProps.state.pageIndex
  );
  const [event, setEventDetails] = useState<any>();

  useEffect(() => {
    setPageCount(tableProps.pageCount);
    setPageIndex(tableProps.state.pageIndex);
  }, [tableProps.pageCount, tableProps.state.pageIndex]);

  /**
   * get filter pages
   */
  const filterPages = useCallback(
    (visiblePages: any, totalPages: number) => {
      return visiblePages.filter((page: any) => page <= pageCount);
    },
    [pageCount]
  );

  /**
   * handle visible pages
   */
  const getVisiblePages = useCallback(
    (page: number | null, total: number) => {
      if (total < 7) {
        return filterPages([1, 2, 3, 4, 5, 6], total);
      } else {
        if (page! % 5 >= 0 && page! > 4 && page! + 2 < total) {
          return [1, page! - 1, page!, page! + 1, total];
        } else if (page! % 5 >= 0 && page! > 4 && page! + 2 >= total) {
          return [1, total - 3, total - 2, total - 1, total];
        } else {
          return [1, 2, 3, 4, 5, total];
        }
      }
    },
    [filterPages]
  );

  /**
   * handle page change
   * @param page - current page
   * @returns
   */
  const changePage = (page: number) => {
    const activePage = pageIndex + 1;

    if (page === activePage) {
      return;
    }

    const visiblePages = getVisiblePages(page, pageCount);
    setVisiblePages(filterPages(visiblePages, pageCount));

    tableProps.gotoPage(page - 1);
  };

  useEffect(() => {
    const visiblePages = getVisiblePages(null, pageCount);
    setVisiblePages(visiblePages);
  }, [pageCount, getVisiblePages]);

  const [visiblePages, setVisiblePages] = useState<number[]>(
    getVisiblePages(null, pageCount)
  );

  const activePage: number = pageIndex + 1;
  const searchParams = new URLSearchParams(location.search);
  const storeData: any = localStorage.getItem("event");
  const eventId: any = searchParams.get("event");

  useLayoutEffect(() => {
    setEventDetails(JSON.parse(storeData));
  }, [storeData]);
  // Add page number parameter
  // Replace pageNumber with the actual page number

  // Construct updated search query

  const updatedSearch = (page: number) => {
    searchParams.set("page", page.toString());
    return `?${searchParams.toString()}`;
  };

  return (
    <>
      <div className="d-lg-flex align-items-center text-center pb-1 pt-1">
        {sizePerPageList.length > 0 && (
          <div className="d-inline-block me-3">
            <label className="me-1">Display :</label>
            <select
              value={tableProps.state.pageSize}
              onChange={(e: any) => {
                tableProps.setPageSize(Number(e.target.value));
              }}
              className="form-select d-inline-block w-auto"
            >
              {(sizePerPageList || []).map((pageSize, index) => {
                return (
                  <option key={index} value={pageSize.value}>
                    {pageSize.text}
                  </option>
                );
              })}
            </select>
          </div>
        )}

        {tableProps.pageOptions.length > 0 && (
          <>
            <span className="me-3">
              Page{" "}
              <strong>
                {pageIndex + 1} of {tableProps.pageOptions.length}
              </strong>{" "}
            </span>
            <ul className="pagination pagination-rounded d-inline-flex ms-auto">
              <li
                key="prevpage"
                className={classNames(
                  "page-item",
                  "paginate_button",
                  "previous",
                  {
                    disabled: activePage === 1,
                  }
                )}
                onClick={() => {
                  if (activePage === 1) return;
                  changePage(activePage - 1);
                }}
              >
                <Link to="#" className="page-link">
                  <i className="uil uil-angle-left"></i>
                </Link>
              </li>
              {(visiblePages || []).map((page, index, array) => {
                return array[index - 1] + 1 < page ? (
                  <React.Fragment key={page}>
                    <li className="page-item disabled d-none d-xl-inline-block">
                      <Link to="#" className="page-link">
                        ...
                      </Link>
                    </li>
                    <li
                      className={classNames(
                        "page-item",
                        "d-none",
                        "d-xl-inline-block",
                        {
                          active: activePage === page,
                        }
                      )}
                      onClick={(e: any) => changePage(page)}
                    >
                      <Link
                        to={{
                          pathname: location.pathname,
                          search: updatedSearch(page),
                          // search: location.search,
                        }}
                        state={location.state}
                        className="page-link rounded"
                      >
                        {page}
                      </Link>
                    </li>
                  </React.Fragment>
                ) : (
                  <li
                    key={page}
                    className={classNames(
                      "page-item",
                      "d-none",
                      "d-xl-inline-block",
                      {
                        active: activePage === page,
                      }
                    )}
                    onClick={(e: any) => changePage(page)}
                  >
                    <Link
                      to={{
                        pathname: location.pathname,
                        search: updatedSearch(page),
                      }}
                      state={location.state}
                      className="page-link rounded"
                      // style={{
                      //   backgroundColor:
                      //     eventId && activePage === page ? event?.themCOlor : "",
                      // }}
                    >
                      {page}
                    </Link>
                  </li>
                );
              })}
              <li
                key="nextpage"
                className={classNames("page-item", "paginate_button", "next", {
                  disabled: activePage === tableProps.pageCount,
                })}
                onClick={() => {
                  if (activePage === tableProps.pageCount) return;
                  changePage(activePage + 1);
                }}
              >
                <Link to="#" className="page-link">
                  <i className="uil uil-angle-right"></i>
                </Link>
              </li>
            </ul>
          </>
        )}
      </div>
    </>
  );
};

export default Pagination;
