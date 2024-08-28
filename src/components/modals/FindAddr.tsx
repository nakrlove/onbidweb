import React, { useEffect, useState, useRef, useCallback } from 'react';
import { RequestApi } from '../../components/fetchapi/FetchApi';
import { Address, IInput } from '../../components/model/regst';
import '../../components/css/FindAddr.css'; // CSS 파일

const SEARCH_TYPE = 0;

const FindAddr: React.FC<IInput> = (props) => {
    const [address, setAddress] = useState<Address[]>([]);
    const [query, setQuery] = useState<{ [key: string]: any }>({});
    const [totalPage, setTotalPage] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageGroup, setPageGroup] = useState<number>(1);
    const [totalCount, setTotalCount] = useState<number>(1);
    const [error, setError] = useState<string | null>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    // const abortControllerRef = useRef<AbortController | null>(null);

    const init = () => {
        // if (abortControllerRef.current) {
        //     abortControllerRef.current.abort();
        // }
        setAddress([]);
        setQuery({});
        setTotalPage(1);
        setTotalCount(1);
        setPageGroup(1);
        setCurrentPage(1);
        setError(null);
    };

    useEffect(() => {
        if (props.show) {
            init();
            if (searchInputRef.current) {
                searchInputRef.current.value = '';
            }
            document.body.classList.add('modal-open'); // 배경 스크롤 방지
        } else {
            document.body.classList.remove('modal-open'); // 배경 스크롤 복구
        }
    }, [props.show]);

    useEffect(() => {
        setTotalPage(pageCalculate(totalCount, 10));
    }, [totalCount]);

    const pageCalculate = (totalCount: number, itemsPerPage: number): number => {
        return Math.ceil(totalCount / itemsPerPage);
    };

    const getCurrentPageRange = (currentPage: number, totalPages: number): [number, number] => {
        const startPage = Math.floor((currentPage - 1) / 10) * 10 + 1;
        const endPage = Math.min(startPage + 9, totalPages);
        return [startPage, endPage];
    };

    const handleSearch = useCallback(async (e: React.FormEvent, param: { [key: string]: any }, initPage: number) => {
        e.preventDefault();

        if (Object.keys(param).length === 0) {
            return;
        }

        // if (abortControllerRef.current) {
        //     abortControllerRef.current.abort();
        // }
        // const abortController = new AbortController();
        // const signal = abortController.signal;
        // abortControllerRef.current = abortController;

        const page = initPage === -100 ? 0 : currentPage;

        let newQuery = { ...param };
        newQuery[`totalPage`] = (10 * (currentPage - 1));
        newQuery[`reload`] = page;
        setQuery(newQuery);

        try {
            const data = await RequestApi("/api/post/findZipCode", "POST", newQuery);
            if (data) {
                if (page === 0) {
                    setTotalCount(data.count);
                    setTotalPage(pageCalculate(totalCount, 10));
                }
                setAddress(data.post);
            } else {
                setAddress([]);
                setError('No addresses found or an error occurred.');
            }
        } catch (err) {
            setError('An error occurred while fetching addresses.');
        }
    }, [currentPage]);

    useEffect(() => {
        if (currentPage === 1) {
            handleSearch(new Event('submit') as unknown as React.FormEvent, query, -100);
        } else {
            handleSearch(new Event('submit') as unknown as React.FormEvent, query, SEARCH_TYPE);
        }
    }, [currentPage]);

    const handleNextPage = () => {
        if (currentPage < totalPage) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    const pageGroupChange = (pageGroup: number) => {
        setPageGroup(pageGroup);
        setCurrentPage(((pageGroup - 1) * 10) + 1); // 첫 페이지로 이동
    };

    const handlePrevPageGroup = () => {
        if (pageGroup > 1) {
            pageGroupChange(pageGroup - 1);
        }
    };

    const handleNextPageGroup = () => {
        if (pageGroup * 10 < totalPage) {
            setPageGroup(pageGroup + 1);
            setCurrentPage((pageGroup * 10) + 1); // 첫 페이지로 이동
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
    };

    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        setTotalPage(1);
        setPageGroup(1);
        let newQuery: Record<string, any> = {};
        newQuery[`addr1`] = searchInputRef.current?.value || "";
        setCurrentPage(1);
        handleSearch(e, newQuery, -100); // 현재 searchValue를 검색
    };

    const select = (addr1: string, addr2: string) => {
        props.onSelect(addr2, addr1);
        handleCloseModal();
    };

    const pageing = (): JSX.Element[] => {
        const [startPage, endPage] = getCurrentPageRange(currentPage, totalPage);
        let items = [];
        for (let number = startPage; number <= endPage; number++) {
            items.push(
                <div
                    key={number}
                    className={`pagination-item ${number === currentPage ? 'active' : ''}`}
                    onClick={() => setCurrentPage(number)}
                >
                    {number}
                </div>,
            );
        }
        return items;
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleButtonClick(e as unknown as React.MouseEvent<HTMLButtonElement>);
        }
    };

    const handleCloseModal = () => {
        init();
        if (props.onHide) {
            props.onHide(); // props.onHide 호출
        }
    };

    return (
        <>
            {props.show && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <h2>주소검색</h2>
                            <button className="close-button" onClick={handleCloseModal}>X</button>
                        </div>
                        <div className="modal-body">
                            <div>
                                <li>정확한 주소를 모르시는 경우
                                    <ul>
                                        <li>시/군/구 + 도로명, 동명 또는 건물명<br />
                                        예) 동해시 중앙로, 여수 중앙동, 대전 현대아파트
                                        </li>
                                    </ul>
                                </li>
                            </div>
                            <div>
                                <li>정확한 주소를 아시는 경우
                                    <ul>
                                        <li>도로명 + 건물번호 예) 종로 6</li>
                                        <li>읍/면/동/리 + 지번 예) 서린동 154-1</li>
                                    </ul>
                                </li>
                            </div>
                            <div className="search-input-group">
                                <input
                                    type="text"
                                    placeholder="주소검색"
                                    ref={searchInputRef}
                                    onChange={handleChange}
                                    onKeyDown={handleKeyPress}
                                />
                                <button onClick={handleButtonClick}>조회</button>
                            </div>
                            {error && <p>{error}</p>}
                            {address.length > 0 ? (
                                <ul className="address-list">
                                    {address.map((addr, index) => (
                                        <li
                                            key={index}
                                            onClick={() => select(addr.addr1, addr.addr2)}
                                        >
                                            <div><strong>지 번:</strong> {addr.addr2 || '정보 없음'}</div>
                                            <div><strong>도로명:</strong> {addr.addr1 || '정보 없음'}</div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                !error && <p>No addresses found.</p>
                            )}
                            {totalPage > 1 && (
                                <div className="pagination-container">
                                    <button onClick={handlePrevPageGroup} disabled={pageGroup <= 1}>
                                        {"<<"}
                                    </button>
                                    <button onClick={handlePrevPage} disabled={currentPage <= 1}>
                                        {"<"}
                                    </button>
                                    {pageing()}
                                    <button onClick={handleNextPage} disabled={currentPage >= totalPage}>
                                        {">"}
                                    </button>
                                    <button onClick={handleNextPageGroup} disabled={pageGroup * 10 >= totalPage}>
                                        {">>"}
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button onClick={handleCloseModal}>Close</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default FindAddr;
