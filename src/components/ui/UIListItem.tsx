import React from 'react';
import '../css/common.css';

import styled from 'styled-components';
import minus from '../../assets/minus.png'; // 삭제
interface Item{
  item    : { idx: number; content: string; user: string; regdate: string };
  onDelete: (e: React.MouseEvent<HTMLElement, MouseEvent>,id:number) => void;
}


const Image = styled.img`
  width: 20px;
  height: 20px;
`;

const UIListItem = (obj:Item) => {

  return (
    <div className="list-item">
      <div className="list-item-content">
        <span >{obj.item.content}</span>
        <button onClick={(e) => obj.onDelete(e,obj.item.idx)}>
          <Image src={minus} alt="삭제"/> 
        </button>
      </div>
    </div>
  );
};

export default UIListItem