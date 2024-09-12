import React, { useEffect, useState } from 'react';

import { useCategory } from '../../components/provider/CategoryProvider'; // Context 사용
import useRequestApi from '../fetchapi/useFetchApi'; // Import the custom hook

import UIListItem from '../ui/UIListItem';
import UIInput  from '../ui/UIInput';
import UIButton from '../ui/UIButton';
import '../css/Category.css';

interface CategoryProps {
  show: boolean;
  onClose: (e:React.MouseEvent<HTMLElement,MouseEvent>) => void;
  onSelect: (item: { id: number; content: string }) => void;
}

/**
 * 관심종목 
 * @param param0 
 * @returns 
 */
const Category: React.FC<CategoryProps> = ({ show, onClose, onSelect }) => {
    const RequestApi = useRequestApi(); // useRequestApi 훅을 호출하여 함수 반환
    const [inputCategory,setInputCategory] = useState('');
    const { categories, setCategories } = useCategory(); //provier 적용
    
    const updateDelete = async (url: string, params: any,type:string) => {
     
            const data = await RequestApi({url:url, method:'POST', params:params});
            if(type ==='DELETE'){
                initSearch('/api/onbid/categroyList', {});
                return;
            } 
            if(type ==='ADD'){
                initSearch('/api/onbid/categroyList', {});
                setInputCategory('')
                return;
            }
     
    };

    /** 목록조회 */
    const initSearch = async (url: string, params: any) => {
     
        try {
               
            const data = await RequestApi({url:url, method:'POST', params:params});
            if(data) {
               setCategories(data)
               return;
            }
            
        } catch (err) {
          if (err instanceof Error) {
            console.log({ type: 'SET_ERROR', payload: `An error occurred while fetching data: ${err.message}` });
          } else {
            console.log({ type: 'SET_ERROR', payload: 'An unknown error occurred.' });
          }
        }
    };

    useEffect(() => {

        //initSearch('/api/onbid/categroyList', {});
        document.body.classList.add('modal-open'); // 배경 스크롤 방지
        return () => {
            document.body.classList.remove('modal-open');
        };

    },[show]);

    
    const handleAdd = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault(); // 기본 폼 제출 방지
        e.stopPropagation();
        updateDelete('/api/onbid/categroySave', { content: inputCategory },"ADD");
    };

    const handleDelete = (e: React.MouseEvent<HTMLElement, MouseEvent>,id: number) => {
        e.preventDefault(); // 기본 폼 제출 방지
        e.stopPropagation();
        updateDelete('/api/onbid/categroyDelete', { idx:id },"DELETE");
    };

    return (
        <>
            <div className={`modal-overlay ${show ? '' : 'hidden'}`}></div>
            <div className={`modal ${show ? '' : 'hidden'}`} onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Category Management</h2>
                    <UIButton onClick={(e) => onClose(e) }>
                        <span>X</span>
                    </UIButton>
                </div>
                <UIInput
                    value={inputCategory}
                    onChange={(value:string) => setInputCategory(value)}
                    placeholder={"추가"}
                />
                <UIButton onClick={handleAdd}><span>추가</span></UIButton>

                {categories && categories.map((item) => (
                    <UIListItem
                        key={item.idx}
                        item={item}
                        onDelete={(e) => handleDelete(e,item.idx)}
                    />
                ))}

            </div>
        </>
    );
};

export default Category;
