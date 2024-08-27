import React ,{ useEffect, useState, useRef, useCallback } from 'react';
import ListItem from '../../components/common/CItem';
import { IItem } from '../model/regst';
import '../css/Category.css';
import { RequestApi } from '../../components/fetchapi/FetchApi';
import UIInput from '../ui/UIInput'
import UIButton from '../ui/UIButton';
interface CategoryProps {
  show: boolean;
  onClose: () => void;
  onSelect: (item: { id: number; content: string }) => void;
}

const Category: React.FC<CategoryProps> = ({ show, onClose, onSelect }) => {
  
    const [items, setItems] = React.useState<{ idx: number; content: string, user: string,regdate:string }[]>([]);
    const [searchTerm, setSearchTerm] = React.useState('');
    //const [currentPage, setCurrentPage] = React.useState(1);

    const [query, setQuery] = useState<{ [key: string]: any }>({});
    const [totalPage, setTotalPage] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageGroup, setPageGroup] = useState<number>(1);
    const [totalCount, setTotalCount] = useState<number>(1);
    const [error, setError] = useState<string | null>(null);
    const [inputCategroy,setInputCategroy] = useState<string >('');


    const searchInputRef = useRef<HTMLInputElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const itemsPerPage = 10;

  

    const initSearch = useCallback(async (e: React.FormEvent|null,url:string,param: { [key: string]: any }, initPage: number) => {
        console.log(" =========== initSearch 1============")
        if (e) {
            e.preventDefault();
        }
        console.log(" =========== initSearch 2============")
      

        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        const abortController = new AbortController();
        const signal = abortController.signal;
        abortControllerRef.current = abortController;
        console.log(" =========== initSearch 3============")
        const page = initPage === -100 ? 0 : currentPage;

        let newQuery = { ...param };
     

        console.log(JSON.stringify(newQuery))
        ///setQuery(newQuery);
       
        try {
            const data = await RequestApi(url, "POST", newQuery, signal);
            if (data) {
              console.log(JSON.stringify(data))
                setItems(data)
                if (page === 0) {
                    setTotalCount(data.count);
                    setTotalPage(pageCalculate(totalCount, 10));
                    
                }
            } else {
                setError('No addresses found or an error occurred.');
            }
        } catch (err) {
            setError('An error occurred while fetching addresses.');
        }
    }, [currentPage]);


    useEffect(() => {
       initSearch(null,"/api/onbid/categroyList", {}, 1);
    }, []);

    const pageCalculate = (totalCount: number, itemsPerPage: number): number => {
        return Math.ceil(totalCount / itemsPerPage);
    };

    // const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setSearchTerm(e.target.value);
    //     setInputCategroy(e.target.value)
    // };

    const handleSearch = (Ivalue:string) => {
      // setSearchTerm(Ivalue);
      setInputCategroy(Ivalue)
    };


    const handleAdd = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        // const newItem = { id: Date.now(), content: `새 아이템 ${Date.now()}`,user:'tttt',regdate:'' };
        // setItems([...items, newItem]);
        
        initSearch(e,"/api/onbid/categroySave", {content:inputCategroy}, 1);
       
    };

    const handleEdit = (id: number) => {
        const updatedItems = items.map((item) =>
            item.idx === id ? { ...item, content: `${item.content} (수정됨)` } : item
        );
        setItems(updatedItems);
    };

    const handleDelete = (id: number) => {
        const filteredItems = items.filter((item) => item.idx !== id);
        setItems(filteredItems);
    };

    // const filteredItems = items.filter((item) =>
    //     item.content.toLowerCase().includes(searchTerm.toLowerCase())
    // );

    // const paginatedItems = filteredItems.slice(
    //     (currentPage - 1) * itemsPerPage,
    //       currentPage * itemsPerPage
    // );

    // const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

      // UIInput 컴포넌트에서 전달되는 문자열 값을 처리
  
  return (
    <>
    <div className={`modal-overlay ${show ? '' : 'hidden'}`}></div>
    <div className={`modal ${show ? '' : 'hidden'}`} onClick={(e) => e.stopPropagation()}>
    {/* <h2>모달 목록</h2> */}
      <div className="modal-header">
      <h2>모달 목록</h2>
          {/* <button className="close-button" onClick={onClose}>X</button> */}
          <UIButton onClick={onClose}><span>X</span></UIButton>
      </div>

      <UIInput value={inputCategroy} onChange={handleSearch} placeholder={"검색"} />
      <UIButton onClick={handleAdd}><span>추가</span></UIButton>

      {items && items.map((item) => (
        <ListItem
          key={item.idx}
          item={item}
          onEdit={handleEdit}
          onDelete={handleDelete}
        
        />
      ))}
      <div className="pagination">
        {/* {Array.from({ length: totalPages }, (_, index) => ( */}
        {Array.from({ length: totalCount }, (_, index) => (  
          <button key={index} onClick={() => setCurrentPage(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  </>
  );
};

export default Category;
