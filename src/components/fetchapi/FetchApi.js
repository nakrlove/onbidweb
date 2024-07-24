// 공통 API 요청 함수
const fetchData = async (url, params = {}) => {
    try {
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`${url}?${queryString}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
};

// 주소 검색 함수
export const findaddr = async (str) => {
    const url = 'http://localhost:3000/api/address';
    const params = { query: str };
    
    const data = await fetchData(url, params);
    return data;
};