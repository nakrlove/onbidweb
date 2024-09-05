import React, { useEffect, useState } from 'react';
import {removeCommas} from '../utils/Utils';

function formatNumberWithCommas(value:string) {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

interface NumberInputProps {
    initialValue: string;
    placeholder : string;
    name: string;
    onChange    : (e: React.ChangeEvent<HTMLInputElement>,removeCommasData:string) => void
    style?      : any;
}

const UINumberInput:React.FC<NumberInputProps> = ({ initialValue,placeholder,name,onChange }) => {
    
    // const [value, setValue] = useState(formatNumberWithCommas(initialValue.toString()));
    const [value, setValue]   = useState(formatNumberWithCommas(initialValue));
    useEffect(()=>{
        let removeData = removeCommas(initialValue)
        const fakeEvent = {
            target: {
                name : name,
                value: removeData, // 원하는 값으로 대체
            },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(fakeEvent,removeData)
    },[initialValue])
    // const [mvalue, setMValue] = useState(formatNumberWithCommas(initialValue));
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let inputValue = e.target.value;

        // 숫자 이외의 문자 제거
        inputValue = removeCommas(inputValue);
        inputValue = inputValue.replace(/[^0-9]/g, "");

        // 쉼표 추가
        const formattedValue = formatNumberWithCommas(inputValue);

        // 값 업데이트
        setValue(formattedValue);
        // setMValue(inputValue);
        onChange(e,inputValue)
    };



    return (
        <div>
            <input
                type="text"
                name={name}
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                style={{ width: '99%', textAlign: 'right',marginRight: '0.5%', height: '30px' }}
            />
            {/* <button onClick={handleSubmit}>저장</button> */}
        </div>
    );
}

export default UINumberInput;