import React from 'react';

interface InputProp{
    onClick:(e: React.MouseEvent<HTMLElement, MouseEvent>)=>void;
    children: React.ReactNode; // 버튼 내부의 텍스트 또는 요소를 지정하기 위해 children 사용
}

const UIButton: React.FC<InputProp>  = (props) => {


    const handleChange = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
       // e.preventDefault;
        props.onClick(e); // 입력 요소의 값 추출
    };

    return (
      <>
         <button onClick={handleChange} >{props.children}</button>
      </>
    );
  };
  
export default UIButton