interface FetchDataParams {
  url: string;
  method?: string; // 선택적
  params?: { [key: string]: any }; // 선택적
  abortController: AbortSignal;
}
// import { IAddres } from '../model/regst'
// 공통 API 요청 함수
const fetchData = async ({
  url,
  method = "POST",
  params = {},
  abortController,
}: FetchDataParams) => {
  try {
    const host = "http://localhost:8080";

    const response = await fetch(`${host}${url}`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      signal: abortController,
      body:
        method === "POST" || method === "DELETE"
          ? JSON.stringify(params)
          : null,
    });

    console.log("============== param ===========");
    console.log(response);
    console.log("============== param ===========");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // if (abortController?.aborted) return null;

    const data = await response.json();
    return data;
  } catch (error) {
    // console.error("Error fetching data:", error);
    //return null;

    if (error.name === "AbortError") {
      console.log("Fetch request was aborted");
    } else {
      console.error("An error occurred:", error);
    }
  }
};

// export const RequestApi = async (
//   URL: string,
//   method?: string,
//   params?: { [key: string]: any },
//   abortController?: AbortSignal
// ) => {

export const RequestApi = async (
  url,
  method = "POST",
  params = {},
  abortController
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
    abortController: abortController,
  });
  return data;
};

export const findCount = async (
  params: { [key: string]: any },
  method: string = "POST",
  abortController
) => {
  const url = "/api/post/findCount";

  const fcount = await fetchData({ url, method, params, abortController });
  return fcount;
};
