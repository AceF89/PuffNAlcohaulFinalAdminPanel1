import { useEffect, useState } from "react";
import { set } from "react-hook-form";

interface IApiResponse {
  data: any;
  message: any;
  error: any;
  statusCode: number;
}

interface IPagination {
  pageCount?: number;
  pageNumber?: number;
  pageSize?: number;
  totalItems?: number;
  query?: string;
  filters?:string;
}

interface IPaginationWithFn extends IPagination {
  handleLimitChange: (pageSize: number) => void;
  handlePageChange: (pageNumber: number) => void;
  handleSearch: (query: string) => void;
}

interface useApiOptionsProps {
  enabled?: boolean;
  onSuccess?: (res: IApiResponse) => any;
  onError?: (error: Error) => any;
  onFire?: () => void;
}

interface useApiResults {
  data: any;
  list: Array<any>;
  details: { [key: string]: any };
  fn: (data?: any) => Promise<IApiResponse>;
  reCall: (data?: any) => void;
  errorMessage: string;
  error: any;
  isLoading: boolean;
  isFetching: boolean;
  isSuccess: boolean;
  isError: boolean;
  pagination: IPaginationWithFn;
}

export const useApi = (
  key: string | string[],
  fn: (data?: any) => Promise<IApiResponse>,
  options?: useApiOptionsProps
): useApiResults => {
  const {
    onSuccess = (res: IApiResponse) => res,
    onError = (error: any) => error,
    onFire = () => null,
    enabled = true,
  } = options || {};

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setFetching] = useState(false);
  const [isSuccess, setSuccess] = useState(false);
  const [isError, seIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [error, setError] = useState<any>();
  const [data, setData] = useState<any>();
  const [details, setDetails] = useState<{ [x: string]: any }>({});
  const [list, setList] = useState<Array<any>>([]);
  const [tablePagination, setTablePagination] = useState<IPagination>({
    // pageCount: 1,
    pageNumber: 1,
    pageSize: 10,
    // totalItems: 0,
  });

  const handleTPData = (data: Partial<IPagination>) => {
    return {
      ...tablePagination,
      ...data,
    };
  };

  const handlePageChange = (pageNumber: number) => {
    const curData = handleTPData({ pageNumber: pageNumber + 1 });
    callFn(curData);
    updatePagination(curData);
  };

  const handleLimitChange = (pageSize: number) => {
    const curData = handleTPData({ pageSize: pageSize });
    callFn(curData);
    updatePagination(curData);
  };

  const handleSearch = (query: string) => {
    console.log(query);

    let curData: any;
    delete tablePagination.pageNumber;
    delete tablePagination.pageCount;
    delete tablePagination.totalItems;

    if (query !== "") {
      curData = handleTPData({ query: query, pageNumber: 1, pageSize: 10 });
    } else {
      delete tablePagination.query;
      setTablePagination({ ...tablePagination });
      curData = handleTPData({ pageNumber: 1, pageSize: 10 });
    }

    callFn(curData);
    updatePagination(curData);
  };

  const updatePagination = (data: Partial<IPagination>) => {
    setTablePagination((prevTablePagination) => ({
      ...prevTablePagination,
      ...data,
    }));
  };

  const callFn = async (data?: any) => {
    try {
      onFire();
      setIsLoading(true);
      setFetching(true);
      const apiRes: IApiResponse = await fn(data);
      if (apiRes.statusCode === 200) {
        const resData = apiRes.data;
        if (resData.items) {
          setList(resData.items);
          updatePagination({
            pageNumber: resData.currentPage,
            pageCount: resData.totalPages,
            pageSize: resData.itemsPerPage,
            totalItems: resData.totalItems,
          });
        }
        const tempData = onSuccess(apiRes);
        if (tempData.Data) {
          setDetails(tempData.Data);
        } else {
          setDetails(tempData);
        }
        setData(tempData);
        setSuccess(true);
      } else {
        throw new Error(apiRes.message || apiRes.error);
      }
      return apiRes;
    } catch (error: any) {
      console.error(error);
      seIsError(true);
      setSuccess(false);
      onError(error);
      setError(error);
      setErrorMessage(error.message ? error.message : error);
    } finally {
      setIsLoading(false);
      setFetching(false);
    }
  };

  const reCall = async (data?: any) => {
    return await callFn(data);
  };

  useEffect(() => {
    if (enabled) {
      callFn();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);

  return {
    data,
    list,
    details,
    fn,
    reCall,
    errorMessage,
    error,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    pagination: {
      ...tablePagination,
      handleLimitChange: handleLimitChange,
      handlePageChange: handlePageChange,
      handleSearch: handleSearch,
    },
  };
};
