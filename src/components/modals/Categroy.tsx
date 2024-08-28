import React, { useEffect, useState } from 'react';
import ListItem from '../common/ListItem';
import { RequestApi } from '../../components/fetchapi/FetchApi';
import UIInput from '../ui/UIInput';
import UIButton from '../ui/UIButton';
import '../css/Category.css';

interface CategoryProps {
  show: boolean;
  onClose: () => void;
  onSelect: (item: { id: number; content: string }) => void;
}

const Category: React.FC<CategoryProps> = ({ show, onClose, onSelect }) => {
    const [items,setItems] = useState<{ idx: number; content: string; user: string; regdate: string }[]>([]);
    const [inputCategory,setInputCategory] = useState('');

    const updateDelete = async (url: string, params: any,type:string) => {
     
            const data = await RequestApi(url, 'POST', params);
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
               
            const data = await RequestApi(url, 'POST', params);
            if(data) {
               setItems(data)
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
        initSearch('/api/onbid/categroyList', {});
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
                    <UIButton onClick={onClose}>
                        <span>X</span>
                    </UIButton>
                </div>
                <UIInput
                    value={inputCategory}
                    onChange={(value:string) => setInputCategory(value)}
                    placeholder={"추가"}
                />
                <UIButton onClick={handleAdd}><span>추가</span></UIButton>

                {items && items.map((item) => (
                    <ListItem
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
