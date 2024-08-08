// import { IAddres } from '../model/regst'
// 공통 API 요청 함수
const fetchData = async (
  url,
  params: { [key: string]: any },
  abortController: AbortSignal
) => {
  try {
    const host = "http://localhost:8080";

    const response = await fetch(`${host}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      signal: abortController,
      body: JSON.stringify(params),
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

export const RequestApi = async (
  params: { [key: string]: any },
  URL: string,
  abortController: AbortSignal
) => {
  // const url = "/api/post/find";

  if (URL === null || URL === "") {
    alert("요청주소를 알수 없습니다.");
    return;
  }
  const data = await fetchData(URL, params, abortController);
  return data;
};

export const findCount = async (
  params: { [key: string]: any },
  abortController
) => {
  const url = "/api/post/findCount";

  const fcount = await fetchData(url, params, abortController);
  return fcount;
};
