import React, { useEffect, useState, useRef, useCallback } from 'react';

import Button     from 'react-bootstrap/Button';
import Container  from 'react-bootstrap/Container';
import Modal      from 'react-bootstrap/Modal';
import ListGroup  from 'react-bootstrap/ListGroup';
import Form       from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Pagination from 'react-bootstrap/Pagination';

import {RequestApi ,findCount} from '../../components/fetchapi/FetchApi';
import { Address } from '../../components/model/regst';

import '../../components/css/common.css';

import previousImg from '../../assets/previous.png'; // 이미지 파일을 import
import rightNextImg from '../../assets/right-chevron-.png'; // 이미지 파일을 import
// import buttonNextImg from '../../assets/pngwing.png'; // 이미지 파일을 import
// import buttonNextImg from '../../assets/pngwing.png'; // 이미지 파일을 import
import { debounce } from 'lodash'; // lodash의 debounce를 import 합니다.

// 전체 항목 수와 페이지당 항목 수를 입력받아 필요한 페이지 수를 반환하는 함수
const calculateTotalPages = (totalCount: number, itemsPerPage: number): number => {
    return Math.ceil(totalCount / itemsPerPage);
};

const SEARCH_TYPE = 0
export default function FindAddr(props) {

    const [address,setAddress] = useState<Address[]>([]);
    const [query, setQuery] = useState<{ [key: string]: any }>({});
    // const [query, setQuery] = useState('');
    const [totalPage, setTotalpage] = useState<number>(1);
    const [currentPage,setCurrentPage] =  useState<number>(1); /* 현재 페이지 */
    const [pageGroup, setPageGroup] = useState<number>(1);
    const [totalCount, setTotalCount] = useState<number>(1);

    const [error, setError] = useState(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [debounceSearch,setDebounceSearch] = useState(searchInputRef)
    const abortControllerRef = useRef<AbortController | null>(null);
    console.log(`================= init1 ${JSON.stringify(query)}=================`);

    const init = () =>{
        if (abortControllerRef.current) {
            console.log("abortControllerRef  close called=====")
            abortControllerRef.current.abort();
        }
        //setReload(1)
        setAddress([]);
        setQuery({});
        setTotalpage(1);
        setTotalCount(1);
        setPageGroup(1);
        setCurrentPage(1);
        setError(null);
       
    }
    useEffect(() => {
        if (props.show) {
            // 모달이 열릴 때 상태 초기화
            init()
            if (searchInputRef.current) {
                searchInputRef.current.value = '';
            }
        }
    }, [props.show]);

   
    useEffect(() => {
        const totalPageNum = pageCalculate(totalCount,10)
        setTotalpage(totalPageNum)
    }, [totalCount]);

    // 팝업을 닫을 때 요청을 취소하고 상태를 초기화
    const handleCloseModal = () => {
       init()
       if (props.onHide) {
          props.onHide(); // props.onHide 호출
       }
    };

   /**
     * 전체 항목 수와 페이지당 항목 수를 입력받아 필요한 페이지 수를 반환하는 함수
     * @param totalCount 전체 항목 수
     * @param itemsPerPage 페이지당 항목 수
     * @returns 필요한 페이지 수
    */
    const pageCalculate = (totalCount: number, itemsPerPage: number): number => {
        return Math.ceil(totalCount / itemsPerPage);
    }

    const getCurrentPageRange = (currentPage: number, totalPages: number): [number, number] => {
        const startPage = Math.floor((currentPage - 1) / 10) * 10 + 1;
        const endPage = Math.min(startPage + 9, totalPages);
        return [startPage, endPage];
    };


    const initParam =(str) =>{
        // let newQuery = { ...query };
        // newQuery[`addr1`] = str || "";
        let newQuery = {}
        newQuery[`addr1`] = str || "";
        setQuery(newQuery);
        return newQuery
    }
    // const setParam = useCallback(
    //     debounce((str: string) => {
    //        return initParam(str)
    //     }, 1000), // 300ms 디바운스 지연 시간
    //     [query]
    // );
   
    const handleSearch = useCallback( async (e: React.FormEvent,param:{ [key: string]: any }, initPage: number) =>  {
                                    e.preventDefault();

                                    console.log(`handleSearch param ${JSON.stringify(param)}`)
                                    // AbortController 인스턴스 생성
                                    if (Object.keys(param).length === 0) {
                                        return;
                                    }
                                    console.log(' <<< handleSearch called >>>')
                                  
                                    // 이전 요청을 취소합니다.
                                    if (abortControllerRef.current) {
                                        abortControllerRef.current.abort();
                                        //return;
                                    }
                                    const abortController = new AbortController();
                                    const signal = abortController.signal;
                                    abortControllerRef.current = abortController;
                                 
                                    const page = initPage === -100 ? 0 : currentPage

                                    console.log(` ############ initPage ${page}`)
                                    let newQuery = { ...param };
                                    newQuery[`totalPage`] = (10 * (currentPage-1));
                                    newQuery[`reload`] = page;
                                    setQuery(newQuery);
                                    try{
                                        console.log(` ############ request param ${JSON.stringify(newQuery)}`)
                                        const data = await RequestApi(newQuery,"/api/post/find",signal);
                                        console.log(JSON.stringify(data))

                                        if (data) {

                                            if( page === 0 ){
                                                setTotalCount(data.count)
                                                const totalPageNum = pageCalculate(totalCount,10)
                                                setTotalpage(totalPageNum)
                                            }
                                            setAddress(data.post);
                                            return;
                                        } 

                                        setAddress([]);
                                        setError('No addresses found or an error occurred.');
                                        
                                    } catch (err) {
                                        setError('An error occurred while fetching addresses.');
                                    }
                                  
    }, [currentPage]);
   
  

    //조회요청
    useEffect(() => {
        console.log(` search useEffect ${currentPage} , ${JSON.stringify(query)}`)
        //if (searchInputRef.current) {
            if(currentPage === 1){
                console.log(`1 query search useEffect ${JSON.stringify(query)}`)
                handleSearch(new Event('submit') as unknown as React.FormEvent,query,-100)
            } else {

                console.log(`2 query search useEffect ${JSON.stringify(query)}`)
                handleSearch(new Event('submit') as unknown as React.FormEvent,query,SEARCH_TYPE)
            }
        //}
    }, [currentPage]);

    // '다음 페이지' 클릭 핸들러
    const handleNextPage = () => {
        if (currentPage < totalPage) {
            setCurrentPage(currentPage + 1);
            //setReload(0)
        }
    };

   
    // 이전페이지
    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

   const pageGroupChange = (pageGroup) => {
        setPageGroup(pageGroup);
        setCurrentPage(((pageGroup - 1) * 10) + 1); // 첫 페이지로 이동
   }
    // '다음 10개 페이지' 클릭 핸들러
    const handlePrevPageGroup = () => {
       
        if (pageGroup > 1) {
       
            pageGroupChange(pageGroup - 1);
            console.log(`2 handlePrevPageGroup ${pageGroup},${pageGroup-1} ,${((pageGroup - 1) * 10) + 1} ,currentPage=${currentPage}`)
        }
    };

    // '다음 10개 페이지' 클릭 핸들러
    const handleNextPageGroup = () => {
        if (pageGroup * 10 < totalPage) {
            setPageGroup(pageGroup + 1);
            setCurrentPage((pageGroup * 10) + 1); // 첫 페이지로 이동
            //setReload(0)
        }
    };


    // 입력값 변경 핸들러
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
       //setParam(newValue); // debouncedSetParam 호출
     
    };

    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
            
        setTotalpage(1);
        setPageGroup(1);
        let newQuery = {}
        newQuery[`addr1`] = searchInputRef.current.value || "";
       
        setCurrentPage(1);
        handleSearch(e,newQuery, -100); // 현재 searchValue를 검색
    };

    const select = (addr1,addr2) => {
        props.onSelect(addr1,addr2)
        handleCloseModal()
    }
    const pageing = (): JSX.Element[] =>{
        // 현재 페이지 그룹의 첫 페이지 번호를 계산합니다.
        const [startPage,endPage] = getCurrentPageRange(currentPage,totalPage)
        let items = [];
        for (let number = startPage; number <= endPage; number++) {
          items.push(
            <Pagination.Item key={number} active={number === currentPage} onClick={() => setCurrentPage(number)}>
              {number}
            </Pagination.Item>,
          );
        }

        return items;
    }

    return (
        <Modal {...props}
                backdrop="static" // 모달 외부 클릭 방지
                keyboard={false} // Esc 키로 모달 닫기 방지
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                    주소검색
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                        <Container>
                            <div>
                                <li>정확한 주소를 모르시는 경우
                                    <ul className="v2">
                                        <li className="w_230">시/군/구 + 도로명, 동명 또는 건물명<br/>
                                        예) 동해시 중앙로, 여수 중앙동, 대전 현대아파트
                                        </li>
                                    </ul>
                                </li>
                            </div>
                            <div>
                                <li>정확한 주소를 아시는 경우
                                    <ul className="v2">
                                        <li className="w_230">도로명 + 건물번호 예) 종로 6</li>
                                        <li className="w_230">읍/면/동/리 + 지번 예) 서린동 154-1</li>
                                    </ul>
                                </li>
                            </div>
                        </Container>


                        <InputGroup className="mb-1">
                            <Form.Control
                                        placeholder="주소검색"
                                        ref={searchInputRef}
                                        // value={props.query}
                                        onChange={handleChange}
                                        aria-label="Recipient's username"
                                        aria-describedby="basic-addon2"  />
                            <Button variant="outline-secondary" id="button-addon2" onClick={ (e) => { handleButtonClick(e)} } >조회</Button>
                            {/* <Button variant="outline-secondary" id="button-addon2" onClick={ (e) => setReload(0) } >조회</Button> */}
                        </InputGroup>

                        {error && <p>{error}</p>}

                        {address.length > 0 ? (
                            <ListGroup as="ol" numbered>
                                {address.map((addr, index) => (
                                    <ListGroup.Item
                                        key={index}
                                        as="li"
                                        className="d-flex align-items-start">
                                        <div onClick={ () => select(addr.addr2,addr.addr1) }>
                                            {/* 각 주소 항목의 필요한 속성만 렌더링 */}
                                            <div><strong>지 번:</strong> {addr.addr2 || '정보 없음'}</div>
                                            <div><strong>도로명:</strong> {addr.addr1 || '정보 없음'}</div>
                                          
                                            {/* 필요한 다른 속성들도 여기 추가할 수 있습니다. */}
                                        </div>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        ) : (
                            !error && <p>No addresses found.</p>
                        )}
                       
                        {totalPage > 1 ? (
                                    // <div className="d-flex justify-content-between" style={{ padding: 10, border: 'none', background: 'none' ,width: '2.375rem', height: '2.375rem'} }>
                                    <div className="d-flex justify-content-between align-items-center">
                                     <Pagination size="sm">
                                        <Button onClick={handlePrevPageGroup}    disabled={pageGroup <= 1} className='pagi'>
                                            {/* <img src={previousImg} alt="이전 페이지" style={{ width: '2.375rem', height: '2.275rem'} }/> 다음 10개 페이지 */}
                                            {"<<"}
                                        </Button>
                                        <Button onClick={handlePrevPage}  disabled={currentPage <= 1} className='pagi'>
                                            {/* <img src={previousImg} alt="이전 페이지" style={{ width: '2.375rem', height: '2.275rem'} }/> */}
                                            {"<"}
                                        </Button>

                                         {pageing()}
                                        
                                        <Button onClick={handleNextPage} disabled={currentPage >= totalPage} className='pagi'>
                                            {/* <img src={rightNextImg} alt="다음 페이지" style={{ width: '2.375rem', height: '2.275rem'} }/> */}
                                            {">"}
                                        </Button>
                                        <Button onClick={handleNextPageGroup} disabled={pageGroup * 10 >= totalPage} className='pagi'>
                                        {/* <img src={rightNextImg} alt="다음 페이지" style={{ width: '2.375rem', height: '2.275rem'} }/> 다음 10개 페이지 */}
                                            {">>"}
                                        </Button>
                                        </Pagination>
                                    </div>
                                    ) : (<Pagination size="sm"></Pagination>)
                        }
                </Modal.Body>
                <Modal.Footer>
                    {/* <Button onClick={props.onHide}>Close</Button> */}
                    <Button onClick={handleCloseModal}>Close</Button>
                    
                </Modal.Footer>
        </Modal>
    );
}