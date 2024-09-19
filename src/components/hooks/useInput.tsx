import React,{useState} from 'react';
import {handleSubmit} from '../utils/Utils'

export function useInput(defaultValue:string, validationFn:(value:string)=>boolean) {
    const [value, setValue]  = useState(defaultValue);
    const [removeValue,setRemoveValue] = useState(defaultValue);
    const valueIsValid = validationFn(value);
   
    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
      setValue(event.target.value);
      setRemoveValue(handleSubmit(event.target.value))
      
    }
  
    return {
      value,
      removeValue,
      handleInputChange,
      hasError: !valueIsValid,
    };
  }