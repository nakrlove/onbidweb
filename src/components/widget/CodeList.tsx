import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 임포트
import { RequestApi } from '../fetchapi/FetchApi';
import '../css/common.css';
import { CodeItem,Query } from '../interface/regst';

import styled from 'styled-components';
import plus from '../../assets/plus.png'; // 경로는 파일의 위치에 따라 조정
// import edit from '../../assets/edit.png'; // 경로는 파일의 위치에 따라 조정
// import check from '../../assets/check.png'; // 경로는 파일의 위치에 따라 조정
import search from '../../assets/search.png'; // 경로는 파일의 위치에 따라 조정



import minus from '../../assets/minus.png'; // 삭제
import modify from '../../assets/modify.png'; //메모수정
import edit from '../../assets/edit.png'; // 수정
import check from '../../assets/check.png'; // 저장
import newfile from '../../assets/new-file.png'; // 추가
import save from '../../assets/save.png'; // 저장
import deletebtn from '../../assets/delete-minus.png'; // 저장




const Image = styled.img`
  width: 20px;
  height: 20px;
`;

const CodeList: React.FC = () => {
    const [data, setData] = useState<CodeItem[]>([]); // 초기 데이터는 빈 배열
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages,setTotalPages] = useState<number>(1);
    const [itemsPerPage] = useState<number>(10);
    const searchCode = useRef<HTMLInputElement>(null);
    // const abortControllerRef = useRef<AbortController | null>(null);
    const navigate = useNavigate(); // useNavigate 훅 사용

    const [error,setError] = useState<string>('');
    // 검색 처리
    const handleSearch = () => {
        setCurrentPage(1);
        fetchData(null,"POST"); // 검색 버튼 클릭 시 서버 호출
    };
    // 등록 버튼 클릭 핸들러
    const handleRegisterClick = () => {
        navigate('/code-regist', { replace: true }); // 등록 화면으로 이동
    };


    /** JSON형식 파라메터값 넘기기 (수정요청)*/
    const handleEditClick = (data: object) => {
        const jsonData = JSON.stringify(data);
        const encodedData = encodeURIComponent(jsonData);
        navigate(`/code-regist?data=${encodedData}`, { replace: true }); 
    }

    //삭제 클릭 핸들러
    const handleDeleteClick = (data:CodeItem) => {
        const userConfirmed = window.confirm('삭제하시겠습니까?');
        if (userConfirmed) {
            fetchData(data,"DELETE")
        }
    }
  
    // 페이지 버튼 클릭 처리
    const handlePageChange = (direction: 'next' | 'prev' | 'first' | 'last' | number) => {
        if (direction === 'next') {
            setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
        } else if (direction === 'prev') {
            setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
        } else if (direction === 'first') {
            setCurrentPage(1);
        } else if (direction === 'last') {
            setCurrentPage(totalPages);
        } else {
            setCurrentPage(direction);
        }
    };

    // 페이지 번호 생성
    // let totalPages = Math.ceil(data.length / itemsPerPage);
    let pageNumbers = Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1);

    /* 패이지 재계산 */
    useEffect(() => {
        pageNumbers = Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1);
    }, [data]); // 의존성 배열에 fetchData를 추가



    const fetchData = useCallback(async (data:CodeItem | null,method:string) => {
        if (!searchCode.current) return;

        const formData = new FormData();
        formData.append('filecode', searchCode.current.value);

        // 이전 요청을 취소합니다.
        // if (abortControllerRef.current) {
        //     abortControllerRef.current.abort();
        // }

        // const abortController = new AbortController();
        // const signal = abortController.signal;
        // abortControllerRef.current = abortController;
      
        let newQuery:Query = {
            'codename': searchCode.current?.value ,
            'page': currentPage-1 ,
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
            const resultData = await RequestApi(url,method,newQuery);

            if( method === 'DELETE') {             
                fetchData(null,"POST"); // 컴포넌트가 처음 마운트될 때 데이터 조회
                return;
            }

            // 응답 데이터가 배열인지 확인
            if (Array.isArray(resultData.content) && resultData.content.length !== 0) {
                setData(resultData.content);

                /* 페이징 계산 */
                // setTotalPages(Math.ceil(resultData.count / itemsPerPage));
                setTotalPages(resultData.totalPages);
            } else {
                setTotalPages(1);
                setData([]);
                setError('데이터가 존재하지 않습니다.'); // 응답 데이터가 배열이 아닌 경우 빈 배열로 설정
                console.log('Received data is not an array.');
            }
        } catch (err) {
            setError(`An error occurred while fetching data:${err}`); // 오류 발생 시 빈 배열로 설정
            console.error('An error occurred while fetching data:', err);
        }
    }, [currentPage]);

    useEffect(() => {
        fetchData(null,"POST"); // 컴포넌트가 처음 마운트될 때 데이터 조회
    }, [fetchData,currentPage]); // 의존성 배열에 fetchData를 추가



    return (
        <div className="code-list">
            <div className="header">
                <button className="register-button" onClick={handleRegisterClick}>
                <Image src={plus} alt="add"/>
                </button>
                
                <div className="search-wrapper">
                    <input
                        type="text"
                        ref={searchCode}
                        placeholder="코드명 검색"
                    />
                    <button onClick={handleSearch}>
                    <Image src={search} alt="search"/> 검색
                    </button>
                </div>
            </div>
            <table>
                <thead>
                    <tr >
                        <th style={{ width: '10%', textAlign: 'center',borderLeft: '1px solid #ddd' }}>코드그룹</th>
                        <th style={{ width: '10%', textAlign: 'center',borderLeft: '1px solid #ddd' }}>코드값</th>
                        <th style={{ width: '30%', textAlign: 'center',borderLeft: '1px solid #ddd' }}>코드명</th>
                        <th style={{ width: '10%', textAlign: 'center',borderLeft: '1px solid #ddd' }}>작업</th>
                    </tr>
                </thead>
                <tbody>
                    
                {!data || (Array.isArray(data) && data.length === 0) ? (
                    <tr ><td colSpan={4} className='table-td-text-align-center' >{error}</td></tr>
                ) : ( 
                    data.map(item => (
                        <tr key={item.idx}>
                            <td className='table-td table-td-text-align-center'>{item.scode}</td>
                            <td className='table-td table-td-text-align-center'>{item.code}</td>
                            <td className='left table-td'>{item.name}</td>
                            <td className="table-td table-td-text-align-center">
                                <Image 
                                    src={modify} 
                                    onClick={() => handleEditClick({'idx':item.idx,'code':item.code,'scode':item.scode,'name':item.name})}
                                    alt="modify" 
                                    style={{ width: '38px', height: '38px' }}
                                />
                                <Image 
                                    src={minus} 
                                    onClick={() => handleDeleteClick({'idx':item.idx,'code':item.code,'scode':item.scode,'name':item.name})}
                                    alt="Minus"
                                />
                            </td>
                        </tr>
                    ))
                )}
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
                    disabled={currentPage === totalPages }
                >
                    다음
                </button>
                <button
                    onClick={() => handlePageChange('last')}
                    disabled={currentPage === totalPages}
                >
                    마지막
                </button>
            </div>
        </div>
    );
};

export default CodeList;