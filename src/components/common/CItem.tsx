import React from 'react';
import {IItem} from '../model/regst'
interface Item{
  item: {idx:number,content:string};
  onEdit:(id:number) => void;
  onDelete:(id:number) => void;
}
const CItem = (obj:Item) => {

  return (
    <div className="list-item">
      <span>{obj.item.content}</span>
      <div>
        <button onClick={() => obj.onEdit(obj.item.idx)}>수정</button>
        <button onClick={() => obj.onDelete(obj.item.idx)}>삭제</button>
      </div>
    </div>
  );
};

export default CItem