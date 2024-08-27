import React from 'react';

interface InputProp{
    value   :string;
    onChange:(str:string)=>void;
    placeholder: string;
}

const UIInput: React.FC<InputProp>  = (props) => {


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        //e.preventDefault;
        props.onChange(e.target.value); // 입력 요소의 값 추출
    };
    return (
      <>
         <input type="text" value={props.value} onChange={handleChange} placeholder={props.placeholder} />
      </>
    );
  };
  
export default UIInput