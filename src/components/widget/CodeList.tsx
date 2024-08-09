import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 임포트
import { RequestApi } from '../fetchapi/FetchApi';
import '../css/common.css';

// 데이터 타입 정의
interface CodeItem {
    idx: number;
    code: string;
    codename: string;
}

const CodeList: React.FC = () => {
    const [data, setData] = useState<CodeItem[]>([]); // 초기 데이터는 빈 배열
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(10);

    const searchCode = useRef<HTMLInputElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const navigate = useNavigate(); // useNavigate 훅 사용

    // 검색 처리
    const handleSearch = () => {
        setCurrentPage(1);
        fetchData(null,"POST"); // 검색 버튼 클릭 시 서버 호출
    };
    // 등록 버튼 클릭 핸들러
    const handleRegisterClick = () => {
        navigate('/code-regist'); // 등록 화면으로 이동
    };


    /** JSON형식 파라메터값 넘기기 (수정요청)*/
    const handleEditClick = (data: object) => {
        const jsonData = JSON.stringify(data);
        const encodedData = encodeURIComponent(jsonData);
        navigate(`/code-regist?data=${encodedData}`); 
    }

    //삭제 클릭 핸들러
    const handleDeleteClick = (data:CodeItem) => {
        const userConfirmed = window.confirm('삭제하시겠습니까?');
        if (userConfirmed) {
            fetchData(data,"DELETE")
        }
      
    }
    // 페이지 계산
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    /*
    const currentItems = data
        .filter(item => item.code.includes(searchCode.current?.value.toLowerCase() || ''))
        .slice(indexOfFirstItem, indexOfLastItem);
    */
    // 페이지 버튼 클릭 처리
    const handlePageChange = (direction: 'next' | 'prev' | 'first' | 'last' | number) => {
        if (direction === 'next') {
            setCurrentPage(prevPage => Math.min(prevPage + 1, Math.ceil(data.length / itemsPerPage)));
        } else if (direction === 'prev') {
            setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
        } else if (direction === 'first') {
            setCurrentPage(1);
        } else if (direction === 'last') {
            setCurrentPage(Math.ceil(data.length / itemsPerPage));
        } else {
            setCurrentPage(direction);
        }
    };

    // 페이지 번호 생성
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const pageNumbers = Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1);

    const fetchData = useCallback(async (data:CodeItem,method:string) => {
        if (!searchCode.current) return;

        const formData = new FormData();
        formData.append('filecode', searchCode.current.value);

        // 이전 요청을 취소합니다.
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const abortController = new AbortController();
        const signal = abortController.signal;
        abortControllerRef.current = abortController;

        let newQuery = { 
            'codename': searchCode.current?.value ,
            'page': indexOfFirstItem ,
        };

        //삭제처리  구분자 
        if( method === 'DELETE') {
            try {
                const parsedData =data;
                if (parsedData) {
                    //삭제처리 키값추가 구분자 
                    newQuery = {...newQuery}
                    newQuery[`idx`] = parsedData.idx
                }
            } catch (error) {
                console.error('Failed to parse JSON data from query string:', error);
            }
        }
     
        let url = method === 'POST' ? "/api/onbid/codelist" : "/api/onbid/deletecode";
        try {
            const resultData = await RequestApi(url,method,newQuery, signal);

            if( method === 'DELETE') {
                
                fetchData(null,"POST"); // 컴포넌트가 처음 마운트될 때 데이터 조회
                return;
            }

            console.log("응답결과 ===")
            console.log(resultData)
            // 응답 데이터가 배열인지 확인
            if (Array.isArray(resultData.content)) {
                setData(resultData.content);
            } else {
                setData([]); // 응답 데이터가 배열이 아닌 경우 빈 배열로 설정
                console.log('Received data is not an array.');
            }
        } catch (err) {
            setData([]); // 오류 발생 시 빈 배열로 설정
            console.error('An error occurred while fetching data:', err);
        }
    }, []);

    useEffect(() => {
        fetchData(null,"POST"); // 컴포넌트가 처음 마운트될 때 데이터 조회
    }, [fetchData]); // 의존성 배열에 fetchData를 추가


  // 현재 페이지의 아이템만 필터링
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
   
    return (
        <div className="code-list">
            <div className="header">
                <button className="register-button" onClick={handleRegisterClick}>등록</button>
                <div className="search-wrapper">
                    <input
                        type="text"
                        ref={searchCode}
                        placeholder="코드명 검색"
                    />
                    <button onClick={handleSearch}>검색</button>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th style={{ width: '20%' }}>코드값</th>
                        <th style={{ width: '40%' }}>코드명</th>
                        <th style={{ width: '20%' }}>작업</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map(item => (
                        <tr key={item.idx}>
                            <td>{item.code}</td>
                            <td>{item.codename}</td>
                            <td className="actions">
                                <button className="action-button" onClick={() => handleEditClick({'idx':item.idx,'code':item.code,'codename':item.codename})}>수정</button>
                                <button className="action-button" onClick={() => handleDeleteClick({'idx':item.idx,'code':item.code,'codename':item.codename})}>삭제</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                <button onClick={() => handlePageChange('first')} disabled={currentPage === 1}>처음</button>
                <button onClick={() => handlePageChange('prev')} disabled={currentPage === 1}>이전</button>
                {pageNumbers.map(number => (
                    <button
                        key={number}
                        onClick={() => handlePageChange(number)}
                        className={number === currentPage ? 'active' : ''}
                    >
                        {number}
                    </button>
                ))}
                <button
                    onClick={() => handlePageChange('next')}
                    disabled={currentPage === Math.ceil(data.length / itemsPerPage)}
                >
                    다음
                </button>
                <button
                    onClick={() => handlePageChange('last')}
                    disabled={currentPage === Math.ceil(data.length / itemsPerPage)}
                >
                    마지막
                </button>
            </div>
        </div>
    );
};

export default CodeList;
