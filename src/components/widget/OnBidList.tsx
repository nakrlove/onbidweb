import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 임포트
import { RequestApi } from '../fetchapi/FetchApi';
import '../css/common.css';
import { Query } from '../../components/model/regst';
import styled from 'styled-components';
import plus from '../../assets/plus.png'; // 경로는 파일의 위치에 따라 조정
import edit from '../../assets/edit.png'; // 경로는 파일의 위치에 따라 조정
import search from '../../assets/search.png'; // 경로는 파일의 위치에 따라 조정
const Image = styled.img`
  width: 20px;
  height: 20px;
`;

// 데이터 타입 정의
interface OnbidItem {
     bididx: number;
     addr1 :  string ,
     addr2 :  string ,
     regdate : string ,
     items : string,
     ld_area :  string ,
     ld_area_pyeong:number,
     build_area :  string ,
     build_area_pyeong:number,
     rd_addr :  string ,
     streeaddr2 : string,
     bruptcy_admin_name :  string ,
     bruptcy_admin_phone :  string ,
     renter :  string ,
     estateType :  string ,
     disposal_type :  string ,
     note :  string ,
     land_classification :  string ,
     progress_status : string,
     evalue: string,
    // sdate: string,
     edate: string,
     deposit: string,
     status: string,
     land_classification_name: string
}
  
const OnBidList: React.FC = () => {
    const [data, setData] = useState<OnbidItem[]>([]); // 초기 데이터는 빈 배열
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(10);
    const [totalPages,setTotalPages] = useState<number>(1);
    const searchCode = useRef<HTMLInputElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const navigate = useNavigate(); // useNavigate 훅 사용

    const [error,setError]  = useState<string>('');
    // 검색 처리
    const handleSearch = () => {
        setCurrentPage(1);
        fetchData(null,"POST"); // 검색 버튼 클릭 시 서버 호출
    };
    // 등록 버튼 클릭 핸들러
    const handleRegisterClick = () => {
        navigate('/onbid-regst',{ replace: true }); // 등록 화면으로 이동
    };


    const handleDetailClick = (data: object) => {
        const jsonData = JSON.stringify(data);
        const encodedData = encodeURIComponent(jsonData);
        navigate(`/onbid-detail?data=${encodedData}`,{ replace: true }); // 등록 화면으로 이동
    };

    /** JSON형식 파라메터값 넘기기 (수정요청)*/
    // const handleEditClick = (data: object) => {
    //     const jsonData = JSON.stringify(data);
    //     const encodedData = encodeURIComponent(jsonData);
    //     navigate(`/code-regist?data=${encodedData}`, { replace: true }); 
    // }

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
        //formData.append('filecode', searchCode.current.value);

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
                    newQuery[`idx`] = parsedData.bididx
                }
            } catch (error) {
                setError(`Failed to parse JSON data from query string:${error}`)
                console.error('Failed to parse JSON data from query string:', error);
            }
        }
     
       
        let url = method === 'POST' ? "/api/onbid/onbidAllList" : "/api/onbid/deletecode";
        try {
            const resultData = await RequestApi(url,method,newQuery, signal);

            if( method === 'DELETE') {
                
                fetchData(null,"POST"); // 컴포넌트가 처음 마운트될 때 데이터 조회
                return;
            }

            console.log("응답결과 ===")
            console.log(JSON.stringify(resultData))
            if (Array.isArray(resultData.onbid) && resultData.count !== 0) {
                setData(resultData.onbid);
                /* 페이징 계산 */
                setTotalPages(Math.ceil(resultData.count / itemsPerPage));
                return;
            } 

            setData([]); // 응답 데이터가 배열이 아닌 경우 빈 배열로 설정
            setTotalPages(1);
            setError(`데이트가 존재하지 않습니다.`)
            console.log('Received data is not an array.');
            
        } catch (err) {
            setData([]); // 응답 데이터가 배열이 아닌 경우 빈 배열로 설정
            setTotalPages(1);
            setError(`An error occurred while fetching data:${err}`); // 오류 발생 시 빈 배열로 설정
            console.error('An error occurred while fetching data:', err);
        }
    }, [currentPage]);

    useEffect(() => {
        fetchData(null,"POST"); // 컴포넌트가 처음 마운트될 때 데이터 조회
    }, [fetchData]); // 의존성 배열에 fetchData를 추가


    return (
        <div className="code-list">
            <div className="header">
                <button className="register-button" onClick={handleRegisterClick}>
                    <Image src={plus} alt="modify"/>
                </button>
                <div className="search-wrapper">
                    <input
                        type="text"
                        ref={searchCode}
                        placeholder="코드명 검색"
                       
                    />
                    <button onClick={handleSearch} style={{ width: '22%', textAlign: 'center',border: '1px solid #ddd' }}>
                       <Image src={search} alt="search"/> 검색
                    </button>
                </div>
            </div>
            <table>
                <thead>
                    <tr>
                        <th style={ { width: '50%', textAlign: 'center',borderLeft: '1px solid #ddd' }}>소재지</th>
                        <th style={{ width: '15%', textAlign: 'center',borderLeft: '1px solid #ddd' }}>감정가</th>
                        <th style={{ width: '10%', textAlign: 'center',borderLeft: '1px solid #ddd' }}>입찰일자<br/>마감일자</th>
                        <th style={{ width: '15%', textAlign: 'center',borderLeft: '1px solid #ddd' }}>파산관제인정보</th>
                        {/* <th style={{ width: '30%' }}>감정가\n최저가</th> */}
                        {/* <th style={{ width: '10%' }}>작업</th> */}
                    </tr>
                </thead>
                <tbody>


                    {!data || (Array.isArray(data) && data.length === 0) ? ( 
                        <tr ><td colSpan={4} className='table-td-text-align-center' >{error}</td></tr>
                    ) : (data.map(item => (
                        
                        <tr key={item.bididx} onClick={() => handleDetailClick({ 'bididx':item.bididx })}>
                            <td className='table-td'>
                                {/* <div style={{paddingRight:'20px'}} >다세대주택 (지목:{item.land_classification_name})
                                <div >(지목:낙찰)</div>
                                </div> */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '20px' }}>
                                    <span>다세대주택 (지목: {item.land_classification_name})</span>
                                    { item.status ? (<span className="onbid-color">{item.status}</span>) :("") }
                                </div>
                                <div style={{ 
                                            wordBreak: 'break-word', // 단어가 너무 길면 줄 바꿈
                                            overflowWrap: 'break-word', // 텍스트가 넘치는 경우 줄 바꿈
                                            lineHeight: '1.5', // 줄 높이 조정
                                            color: '#555', // 텍스트 색상 조정
                                            fontSize: '14px' // 텍스트 크기 조정
                                        }}>{item.addr1} {item.addr2}</div>
                                <div className="fontSize13">처분방식 : {item.disposal_type} <span className="orange f12">{item.renter}</span></div>
                                <div className="fontSize13 colorBlue" >토지 {item.ld_area}㎡({ item.ld_area_pyeong}평) 건물 {item.build_area}㎡({item.build_area_pyeong}평)</div>
                            </td>
                            <td className='table-td table-td-text-align-center'>
                                <span className="fontSize13">{item.evalue}</span>
                            </td>
                            <td className='table-td table-td-text-align-center'>
                                {/* <span className="fontSize13">{item.sdate}</span><br/> */}
                                <span className="fontSize13">{item.edate}</span>
                            </td>
                            <td className='table-td table-td-text-align-center'>
                                <span className="fontSize13">{item.bruptcy_admin_name}</span><br/>
                                <span className="fontSize13">{item.bruptcy_admin_phone}</span>
                            </td>
                        </tr>
                    )))}
            
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
