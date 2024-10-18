import React, { useRef, useEffect, forwardRef, useState } from "react";
import {
  useTable,
  useSortBy,
  usePagination,
  useRowSelect,
  useGlobalFilter,
  useAsyncDebounce,
  useExpanded,
} from "react-table";
import classNames from "classnames";

// components
import Pagination from "./Pagination";
import Scrollbar from "./Scrollbar";
import Loader from "./Loader";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

interface GlobalFilterProps {
  totalItems: number;
  globalFilter: any;
  setGlobalFilter: any;
  searchBoxClass: any;
  handleSearch?: (value: string) => void;
}

// Define a default UI for filtering
const GlobalFilter = ({
  totalItems,
  globalFilter,
//   setGlobalFilter,
  searchBoxClass,
  handleSearch,
}: GlobalFilterProps) => {
  const count = totalItems;
  const [value, setValue] = useState<any>(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    if(handleSearch){
        handleSearch(value || '');
    }
    // setGlobalFilter(value || undefined);
  }, 200);

  return (
    <div className={classNames(searchBoxClass)}>
      <span className="d-flex align-items-center">
        Search :{" "}
        <input
          type="search"
          value={value || ""}
          onChange={(e: any) => {
            setValue(e.target.value);
            onChange(e.target.value);
          }}
          placeholder={`${count} records...`}
          className="form-control w-auto ms-1"
        />
      </span>
    </div>
  );
};

interface IndeterminateCheckboxProps {
  indeterminate: any;
  children?: React.ReactNode;
}

const IndeterminateCheckbox = forwardRef<
  HTMLInputElement,
  IndeterminateCheckboxProps
>(({ indeterminate, ...rest }, ref) => {
  const defaultRef = useRef();
  const resolvedRef: any = ref || defaultRef;

  useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);

  return (
    <>
      <div className="form-check">
        <input
          type="checkbox"
          className="form-check-input"
          ref={resolvedRef}
          {...rest}
        />
        <label htmlFor="form-check-input" className="form-check-label"></label>
      </div>
    </> 
  );
});

// pageCount: number,
// pageOptions: Array<any>
// setPageSize: (page: number) => void,
// gotoPage: (page: number) => void,
// state: {
//     pageIndex: number,
//     pageSize: number,
// }
interface CustomPagination {
  pagination?: boolean;
	pageCount?: number;
	pageNumber?: number;
	pageSize?: number;
    totalItems?: number;
    query?: string;
    handleLimitChange?: (pageSize: number) => void;
	handlePageChange?: (pageNumber: number) => void;
    handleSearch?:(search: string) => void;
}

interface TableProps extends CustomPagination {
  isSearchable?: boolean;
  isSortable?: boolean;
  pagination?: boolean;
  isSelectable?: boolean;
  isExpandable?: boolean;
  isFetching?: boolean;
  sizePerPageList?: {
    text: string;
    value: number;
  }[];
  columns: {
    Header: string;
    accessor: any;
    sort?: boolean;
    Cell?: any;
    className?: string;
    colKey?: string;
  }[];
  data: any[];
  pageSize?: number;
  searchBoxClass?: string;
  tableClass?: string;
  theadClass?: string;
  updateData?: any,
  isDragble?: boolean;
  onRowClick?: (row: any, cell:any) => void;
  handleColumnSort?: (key: string, order: string) => void;
  handleSetOrder?: any;
}

const Table = (props: TableProps) => {
  const isSearchable = props["isSearchable"] || false;
  const isSortable = props["isSortable"] || false;
  const pagination = props["pagination"] || false;
  const isSelectable = props["isSelectable"] || false;
  const isExpandable = props["isExpandable"] || false;
  const sizePerPageList = props["sizePerPageList"] || [];
  const isFetching = props["isFetching"] || false;
  const pageCount = props["pageCount"] || 0;
  const currentPage = props["pageNumber"] || 0;
  const pageSize = props["pageSize"] || 0;
  const totalItems = props["totalItems"] || 0;
  const query = props["query"] || '';

  const handleLimitChange = props["handlePageChange"];
  const handlePageChange = props["handlePageChange"];
  const handleSearch = props["handleSearch"];
  const [data, setData] = useState(props.data);

  let otherProps: any = {};

  if (isSearchable) {
    otherProps["useGlobalFilter"] = useGlobalFilter;
  }
  if (isSortable) {
    otherProps["useSortBy"] = useSortBy;
  }
  if (isExpandable) {
    otherProps["useExpanded"] = useExpanded;
  }
  if (pagination) {
    otherProps["usePagination"] = usePagination;
  }
  if (isSelectable) {
    otherProps["useRowSelect"] = useRowSelect;
  }

  const [sorting, setSorting] = useState({
    column: null,
    direction: 'asc',
  });

  const compareIgnoreCase = (a: string, b: string) => {
    let r1 = a.toLowerCase();
    let r2 = b.toLowerCase();
    if (r1 < r2) {
      return -1;
    }
    if (r1 > r2) {
      return 1;
    }
    return 0;
  };

  const dataTable = useTable(
    {
      columns: props["columns"],
      data: props["data"],
      initialState: { pageSize: props["pageSize"] || 10 },
      sortTypes: {
        alphanumeric: (row1, row2, columnName) => {
          return compareIgnoreCase(
            row1.values[columnName],
            row2.values[columnName]
          )
        },
      },
    },
    otherProps.hasOwnProperty("useGlobalFilter") &&
      otherProps["useGlobalFilter"],
    otherProps.hasOwnProperty("useSortBy") && otherProps["useSortBy"],
    otherProps.hasOwnProperty("useExpanded") && otherProps["useExpanded"],
    otherProps.hasOwnProperty("usePagination") && otherProps["usePagination"],
    otherProps.hasOwnProperty("useRowSelect") && otherProps["useRowSelect"],
    (hooks) => {
      isSelectable &&
        hooks.visibleColumns.push((columns: any) => [
          // Let's make a column for selection
          {
            id: "selection",
            // The header can use the table's getToggleAllRowsSelectedProps method
            // to render a checkbox
            Header: ({ getToggleAllPageRowsSelectedProps }: any) => (
              <div>
                <IndeterminateCheckbox
                  {...getToggleAllPageRowsSelectedProps()}
                />
              </div>
            ),
            // The cell can use the individual row's getToggleRowSelectedProps method
            // to the render a checkbox
            Cell: ({ row }: any) => (
              <div>
                <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
              </div>
            ),
          },
          ...columns,
        ]);

      isExpandable &&
        hooks.visibleColumns.push((columns: any) => [
          // Let's make a column for selection
          {
            // Build our expander column
            id: "expander", // Make sure it has an ID
            Header: ({
              getToggleAllRowsExpandedProps,
              isAllRowsExpanded,
            }: any) => (
              <span {...getToggleAllRowsExpandedProps()}>
                {isAllRowsExpanded ? "-" : "+"}
              </span>
            ),
            Cell: ({ row }) =>
              // Use the row.canExpand and row.getToggleRowExpandedProps prop getter
              // to build the toggle for expanding a row
              row.canExpand ? (
                <span
                  {...row.getToggleRowExpandedProps({
                    style: {
                      // We can even use the row.depth property
                      // and paddingLeft to indicate the depth
                      // of the row
                      paddingLeft: `${row.depth * 2}rem`,
                    },
                  })}
                >
                  {row.isExpanded ? "-" : "+"}
                </span>
              ) : null,
          },
          ...columns,
        ]);
    }
  );

  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  let rows = dataTable.rows;

   
  const handleSort = (columnAccessor:any) => {
    const newDirection =
      sorting.column === columnAccessor && sorting.direction === "asc"
        ? "desc"
        : "asc";

    setSorting({
      column: columnAccessor,
      direction: newDirection,
    });
    if(props?.handleColumnSort){
      props?.handleColumnSort(columnAccessor, newDirection);
    }
  };
  const handleOnDragEnd = (result: any) => {
    if (!result.destination) return;
    const reorderedData = Array.from(data);
    const [movedItem] = reorderedData.splice(result.source.index, 1);
    reorderedData.splice(result.destination.index, 0, movedItem);
    setData(reorderedData);
    props?.handleSetOrder(reorderedData);
  };

  return (
    <>
   <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="droppable">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="table-responsive"
          >
            <Scrollbar>
              {isSearchable && (
                <GlobalFilter
                  totalItems={totalItems}
                  globalFilter={query}
                  setGlobalFilter={dataTable.setGlobalFilter}
                  searchBoxClass={props["searchBoxClass"]}
                  handleSearch={handleSearch}
                />
              )}
              <table
               {...dataTable.getTableProps()}
                className={classNames("table table-centered react-table",  props["tableClass"])}
              >
                <thead className={props["theadClass"]}>
  <tr>
    {props.columns.map((column, index) => (
      <th
        key={index}
        onClick={() => handleSort(column.colKey || column.accessor)}
        className={classNames({
          sorting_desc: sorting.column === (column.colKey || column.accessor) && sorting.direction === 'desc',
          sorting_asc: sorting.column === (column.colKey || column.accessor) && sorting.direction === 'asc',
          sortable: column.sort === true,
        })}
      >
        {column.Header}
        {column.sort && (
          // Uncomment the line below if you want to include sorting icons
          // <FontAwesomeIcon
          //   icon={sorting.column === (column.colKey || column.accessor) && sorting.direction === 'desc' ? faSortDown : faSortUp}
          // />
          ''
        )}
      </th>
    ))}
  </tr>
</thead>

           
                <tbody {...dataTable.getTableBodyProps()}>
                  {!isFetching && !rows.length && <tr className="text-center text-danger fs-18">
                    <td colSpan={props["columns"].length < 10 ? props["columns"].length : 8 }>No Data Found!</td>
                  </tr>}
                  {isFetching ? <tr className="text-center text-success fs-18 p-10">
                    <td style={{padding:'80px'}}  colSpan={props["columns"].length < 10 ? props["columns"].length : 8 }><Loader /></td>
                  </tr> :
                  rows.map((row, index) => {
                    dataTable.prepareRow(row);
                    return (
                      <Draggable
                        key={row.id}
                        draggableId={row.id}
                        index={index}
                      >
                        {(provided) => (
                          <tr
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...row.getRowProps()}
                            className={classNames({ "cursor-pointer":props?.onRowClick })}
                            {...provided.dragHandleProps}
                          >
                            {(row.cells || []).map((cell: any)=> (
                              <td
                              {...cell.getCellProps([
                                {
                                  className: cell.column.className,
                                },
                              ])}
                                onClick={() => {
                                  if (props.onRowClick) {
                                    props.onRowClick(row, cell);
                                  }
                                }}
                              >
                                {cell.render("Cell")}
                              </td>
                            ))}
                          </tr>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </tbody>
              </table>
            </Scrollbar>
            {pagination && (
              <Pagination
                tableProps={{
                  pageCount,
                  pageOptions: Array.from({ length: pageCount }, (_, i) => i + 1),
                  setPageSize: (page: number) => {
                    if (handleLimitChange) {
                      handleLimitChange(page);
                    }
                  },
                  gotoPage: (page: number) => {
                    if (handlePageChange) {
                      handlePageChange(page);
                    }
                  },
                  state: {
                    pageIndex: currentPage - 1,
                    pageSize,
                  }
                }}
                sizePerPageList={sizePerPageList}
              />
            )}
          </div>
        )}
      </Droppable>
    </DragDropContext>
    </>
  );
};

export default Table;
