import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 임포트
import { RequestApi } from '../fetchapi/FetchApi';
import '../css/common.css';
import { Query } from '../../components/model/regst';
// 데이터 타입 정의
interface OnbidItem {
    idx: number;
    code: string;
    subcode: string;
    codename: string;
}
  
const OnBidList: React.FC = () => {
    const [data, setData] = useState<OnbidItem[]>([]); // 초기 데이터는 빈 배열
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(10);
    const [totalPages,setTotalPages] = useState<number>(1);
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
        navigate('/onbid-regst'); // 등록 화면으로 이동
    };


    /** JSON형식 파라메터값 넘기기 (수정요청)*/
    const handleEditClick = (data: object) => {
        const jsonData = JSON.stringify(data);
        const encodedData = encodeURIComponent(jsonData);
        navigate(`/code-regist?data=${encodedData}`); 
    }

    //삭제 클릭 핸들러
    const handleDeleteClick = (data:OnbidItem) => {
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
   // const totalPages = Math.ceil(data.length / itemsPerPage);
    let pageNumbers = Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1);
    /* 패이지 재계산 */
    useEffect(() => {
        pageNumbers = Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1);
    }, [data]); // 의존성 배열에 fetchData를 추가

    const fetchData = useCallback(async (data:OnbidItem | null,method:string) => {
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
            const resultData = await RequestApi(url,method,newQuery, signal);

            if( method === 'DELETE') {
                
                fetchData(null,"POST"); // 컴포넌트가 처음 마운트될 때 데이터 조회
                return;
            }

            console.log("응답결과 ===")
            console.log(resultData)
            if (Array.isArray(resultData.codes.content)) {
                setData(resultData.codes.content);

                /* 페이징 계산 */
                setTotalPages(Math.ceil(resultData.count / itemsPerPage));
            } else {
                setData([]); // 응답 데이터가 배열이 아닌 경우 빈 배열로 설정
                console.log('Received data is not an array.');
            }
        } catch (err) {
            setData([]); // 오류 발생 시 빈 배열로 설정
            console.error('An error occurred while fetching data:', err);
        }
    }, [currentPage]);

    useEffect(() => {
        fetchData(null,"POST"); // 컴포넌트가 처음 마운트될 때 데이터 조회
    }, [fetchData]); // 의존성 배열에 fetchData를 추가


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
                        <th style={{ width: '50%' }}>소재지</th>
                        <th style={{ width: '15%' }}>감정가</th>
                        <th style={{ width: '10%' }}>입찰일자<br/>마감일자</th>
                        <th style={{ width: '15%' }}>파산관제인정보</th>
                        {/* <th style={{ width: '30%' }}>감정가\n최저가</th> */}
                        {/* <th style={{ width: '10%' }}>작업</th> */}
                    </tr>
                </thead>
                <tbody>
                    {data.map(item => (
                        <tr key={item.idx}>
                            <td className='table-td'>
                                <div style={{paddingRight:'20px'}} >다세대주택</div>
                                <div style={{ 
                                            wordBreak: 'break-word', // 단어가 너무 길면 줄 바꿈
                                            overflowWrap: 'break-word', // 텍스트가 넘치는 경우 줄 바꿈
                                            lineHeight: '1.5', // 줄 높이 조정
                                            color: '#555', // 텍스트 색상 조정
                                            fontSize: '14px' // 텍스트 크기 조정
                                        }}>서울특별시 은평구 응암동 120-7 더어베인 703호 다세대주택</div>
                                <div className="fontSize13">처분방식 : 매각&nbsp;&nbsp;<span className="orange f12">지상권/지역권,대항력 여지 있는 임차인</span></div>
                                <div className="fontSize13 colorBlue" >토지 723.9㎡(218.98평) 건물 592.44㎡(179.213평)</div>
                            </td>
                            <td>
                                <span className="fontSize13">28,470,000,000</span>
                            </td>
                            <td>
                                <span className="fontSize13">05.10 10:00</span><br/>
                                <span className="fontSize13">05.10 17:00</span>
                            </td>
                            <td>
                                <span className="fontSize13">홍길동</span><br/>
                                <span className="fontSize13">02-1234-1234</span>
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
                    disabled={currentPage === totalPages}
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

export default OnBidList;
