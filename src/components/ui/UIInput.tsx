import React from 'react';

interface InputProp{
    value   :string;
    onChange:(value: string)=>void;
    placeholder: string;
}

const UIInput: React.FC<InputProp>  = (props) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        props.onChange(e.target.value); // 입력 요소의 값 추출
    };
    return (
      <>
         <input style={{ marginRight: '10px',padding: '12px', fontSize: '16px',width: '300px'}} type="text" value={props.value} onChange={handleChange} placeholder={props.placeholder} />
      </>
    );
  };
  
export default UIInput