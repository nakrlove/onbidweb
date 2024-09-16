import React, { useState,useEffect } from "react";

import useRequestApi from '../fetchapi/useFetchApi'; // Import the custom hook
import { useCategory,useLoading } from '../provider/CategoryProvider'; // Context 사용
import { Code, States }  from '../interface/regst';

interface CommonSet<TLandClassifiArray,TSelectOptions,TEstateTypes,TStates> {
    rland_classification_array:TLandClassifiArray[];
    rselectsOptions: TSelectOptions  [];
    restateTypes   : TEstateTypes  [];
}
// const useInitData = (action:Boolean):CommonSet<Code, Code, Code, States> => {
const useInitData = (action:Boolean) => {

    let rland_classification_array: Code[] = [];
    let rselectsOptions: Code  [] = [];
    let restateTypes   : Code  [] = [];
    let rcategories    : States[] = []; 
    const RequestApi = useRequestApi(); // useRequestApi 훅을 호출하여 함수 반환
    const { categories, setCategories } = useCategory(); //provier 적용
   

    const [data, setData] = useState({
        rselectsOptions: rselectsOptions,
        rland_classification_array: rland_classification_array,
        restateTypes: restateTypes
    });
   
    useEffect(() => {

        const getData = async() => {
         
                /* 파일첨부 코드조회 */
                try {
                    // const response = await axios.post('/api/onbid/file-code');
                    const response = await RequestApi({url:'/api/onbid/file-code',method:"POST"});
                
                    rselectsOptions = response
                    setData(prevData => ({
                        ...prevData,
                        rselectsOptions: response, // 변경하고자 하는 속성만 수정
                    }));
                  
                } catch (error) {
                    console.error('Error fetching select options:', error);
                }

                /* 지목 */
                try {
                    // const response = await axios.post('/api/onbid/file-code?codes=003');
                    const response = await RequestApi({url:'/api/onbid/file-code?codes=003',method:"POST"});
                    // setLandclassificationarray(response.data);
                    rland_classification_array = response;
                    
                    setData(prevData => ({
                        ...prevData,
                        rland_classification_array: response, // 변경하고자 하는 속성만 수정
                    }));
             
                } catch (error) {
                    console.error('Error fetching select options:', error);
                }

          
                /* 부동산종류 */
                try {
                    // const response = await axios.post('/api/onbid/file-code?codes=044&codes=089&codes=065');
                    const response = await RequestApi({url:'/api/onbid/file-code?codes=044&codes=089&codes=065',method:"POST"});
                    restateTypes = response;
                   // setEstateTypes(restateTypes);
                    setData(prevData => ({
                        ...prevData,
                        restateTypes: response, // 변경하고자 하는 속성만 수정
                    }));
             
                } catch (error) {
                    console.error('Error fetching select options:', error);
                }


                /* 관심목록 */
                // console.log(` action value=${action}`)
                if(action){
                    try {
                        // const response = await axios.post('/api/onbid/categroyList');
                        const response = await RequestApi({url:'/api/onbid/categroyList',method:"POST"});
                        rcategories = response;
                        setCategories(rcategories);
                        // setData(prevData =>({
                        //     ...prevData,
                        //     restateTypes: response, // 변경하고자 하는 속성만 수정
                        // }));
                    
                    } catch (error) {
                        console.error('Error fetching select options:', error);
                    }
                }
            
        }
        getData();
    },[])
 
     return data
    //return {rselectsOptions,rland_classification_array,restateTypes,rcategories}    
}

export default useInitData;