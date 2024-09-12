import React, { useEffect, useState,useCallback } from "react";
import { useLoading } from '../provider/CategoryProvider'; // LoadingContext import

let abortController: AbortController | null = null;

export const getAbortController = (): AbortController => {
  // 이전 컨트롤러가 존재하면 abort
  if (abortController) {
    abortController.abort();
  }
  // 새 컨트롤러 생성
  abortController = new AbortController();
  return abortController;
};

export const getAbortSignal = (): AbortSignal => {
  return getAbortController().signal;
};

interface FetchDataParams {
  url: string;
  method?: string; // 선택적
  params?: { [key: string]: any }; // 선택적
  //abortController: AbortSignal;
}

const useRequestApi = () => {
  const { setIsLoading } = useLoading(); // Use the context to get setIsLoading function
  // import { IAddres } from '../model/regst'
  // 공통 API 요청 함수
  const RequestApi = useCallback(async ({
                            url,
                            method = "POST",
                            params = {},
                          }: FetchDataParams) => {
      
      try {
            setIsLoading(true); // Set loading to true
            //const abortController = getAbortController();
            const abortController = getAbortSignal();
            const host = process.env.REACT_APP_API_URL;
            const response = await fetch(`${host}${url}`, {
                                                            method: method,
                                                            headers: {
                                                              "Content-Type": "application/json",
                                                            },
                                                            signal: abortController,
                                                            body: JSON.stringify(params),
                                                            // body:
                                                            //   method === "POST" || method === "DELETE" || method === "PUT"
                                                            //     ? JSON.stringify(params)
                                                            //     : null,
            });

            // console.log("============== param ===========");
            // console.log(response);
            // console.log("============== param ===========");
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData.message);
            }

            if (abortController?.aborted) return null;

            const data = await response.json();
            return data;
      } catch (error) {
        console.error("Error fetching data:", JSON.stringify(error));
        // if (error instanceof Error) {
        //   alert(`${error.message}`);
        // } else {
        //   alert(`An unknown error occurred`);
        // }
    
      } finally {
        setIsLoading(false); // Set loading to true
      }
    }, [setIsLoading]);
    return RequestApi;
};


/*
export const RequestApi = async (
                                  url: string,
                                  method = "POST",
                                  params = {},
                                  abortController?: AbortSignal | null | undefined
                                ) => {
       // const url = "/api/post/find";
      if (url === null || url === "") {
        alert("요청주소를 알수 없습니다.");
        return;
      }
      
      const data = await fetchData({
                                    url: url,
                                    method: method,
                                    params: params,
                                  });
      return data;
};

export const findCount = async (
                                  params: { [key: string]: any },
                                  method: string = "POST",
                                  abortController: AbortSignal
                               ) => {
  const url = "/api/post/findCount";
  const fcount = await fetchData({ url, method, params });
  return fcount;
};
*/

export default useRequestApi;