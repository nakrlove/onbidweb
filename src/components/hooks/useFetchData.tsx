import { useState, useEffect } from 'react';
//import { RequestApi } from '../fetchapi/useFetchApi';
import useRequestApi from '../fetchapi/useFetchApi'; // Import the custom hook
import { Attchfile } from '../interface/regst';
import { useLocation } from 'react-router-dom';
import { useLoading } from '../provider/CategoryProvider'; // LoadingContext import
import {fileFromBase64} from '../utils/Utils'
import axios from 'axios';
// import useCustomStateManagement  from '../hooks/useCustomStateManagement';


interface UseFetchData<TDate, TDays, TMemo, TAttachFile,TStatus>  {
    data       : TDate   | null;
    days       : TDays[]       ;
    memos      : TMemo[]       ;
    status     : TStatus[]     ;
    bididx     : number  | null;
    attchfile  : TAttachFile[] ;
    loading    : boolean       ;
    error      : string  | null;
    setDays    : (updateFn: (prevDays: TDays[]) => TDays[] ) => void;
    replaceDays: (newDays : TDays[])  => void; // 배열을 새로 교체하는 함수
    appendDays : (newDay  : TDays)    => void; // 배열에 새 데이터를 추가하는 함수
    setMemos    : (updateFn: (prevMemo: TMemo[] ) => TMemo[]) => void;  // 배열
   // safeSetMemo : (updateFn: (prevMemo: TMemo[] ) => TMemo[] ) => void;
    replaceMemos: (prevMemo: TMemo[] ) =>  void;  // 배열
    // setMemo: React.Dispatch<React.SetStateAction<T | null>>; // 상태 업데이트 함수 추가
}


const useFetchData = <
     TDate = any
    ,TDays = any
    ,TMemo = any
    ,TAttachFile = any
    ,TStatus = any
>(): UseFetchData<TDate, TDays, TMemo, TAttachFile,TStatus>  => {
   
    const { setIsLoading } = useLoading(); // Use the context to get setIsLoading function
    const RequestApi = useRequestApi(); // useRequestApi 훅을 호출하여 함수 반환

    const [data     , setData]      = useState<TDate|null>(null);//파산공매 기본사항
    const [status   , setStatus]    = useState<TStatus[]>([]); // 진행상태
    const [days     , setDays]      = useState<TDays[]>([]);   // days는 배열로 설정
    const [memos    , setMemos]     = useState<TMemo[]>([]);   // 메모
    const [attchfile, setAttchFile] = useState<TAttachFile[]>([]);
    const [bididx   , setBididx]    = useState<number | null>(null);
    const [loading  , setLoading]   = useState<boolean>(true);
    const [error    , setError]     = useState<string | null>(null);

    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const paramData = queryParams.get('data');           

    useEffect(() => {
        
        const getData = async () => {
          
            if (paramData) {
                try {
                    // URLSearchParams로 추출된 데이터를 JSON으로 파싱
                    const parsedData = JSON.parse(paramData);
                    setIsLoading(true)
                    if (parsedData) {
                        // API 요청을 통해 데이터 조회
                        const dataResponse = await RequestApi({url:"/api/onbid/onbid-detail", method:"POST", params:parsedData});
                        if (dataResponse) {
                            setData(dataResponse.bidMap);
                            setDays(dataResponse.bidDay);

                            console.log(` memo ${JSON.stringify(dataResponse.memos)}`)
                            setMemos(dataResponse.memos);
                            setBididx(parsedData.bididx);
                        }

                        // 파일 첨부용 카테고리 조회
                        const attchfileResponse = await RequestApi({url:"/api/onbid/category", method:"POST", params:parsedData});
                        if (attchfileResponse) {
                            // 파일 데이터가 포함된 response를 처리
                            const updatedFiles = await Promise.all(attchfileResponse.map(async (fileWrapper: Attchfile) => {
                                if (fileWrapper.idx) {
                                    // 파일 다운로드 요청
                                    const fileResponse = await fetch(`/api/onbid/file/${fileWrapper.idx}`);
                                    const blob = await fileResponse.blob();
                                    const file = new File([blob], fileWrapper.filename, {
                                        type: fileWrapper.filetype
                                    });
                                    return {
                                        ...fileWrapper,
                                        file: file
                                    };
                                } else {
                                    return fileWrapper; // 파일이 없는 경우
                                }
                            }));

                            setAttchFile(updatedFiles);
                            // console.log(`Files ${JSON.stringify(attchfileResponse)}`)
                        }

                        /* 입찰진행상태 */
                        try {
                            const response = await axios.post('/api/onbid/file-code?codes=037');
                            setStatus(response.data);
                        } catch (error) {
                            console.error('Error fetching select options:', error);
                        }

                    }
                } catch (err) {
                    setError('데이터를 가져오는데 문제가 발생했습니다.');
                } finally {
                    setIsLoading(false)
                }
            }
        };

        getData();
    }, [paramData]); // paramData가 변경될 때마다 데이터 로딩


    const safeSetDays = (updateFn: (prevDays: TDays[]) => TDays[] ) => {
        setDays((prevDays) => {
            const newDays = updateFn(prevDays);
            // newDays가 배열이거나 null인 경우에만 업데이트
            if (newDays === null || Array.isArray(newDays)) {
                return newDays;
            }
            return prevDays;
        });
    };

    // 배열을 덮어쓰기
    const replaceDays = (newDays: TDays[]) => {
        setDays(newDays);
    };

    // 배열에 새 데이터를 추가
    const appendDays = (newDay: TDays) => {
        setDays(prevDays => (prevDays ? [...prevDays, newDay] : [newDay]));
    };

    const safeSetMemo = (updateFn: (prevMemo: TMemo[] ) => TMemo[] ) => {
        setMemos((prevMemo) => {
            const newMemo = updateFn(prevMemo);
            // T가 string[]인 경우에만 배열에 추가하는 로직을 허용
            if (Array.isArray(newMemo)) {
                return newMemo;
            }
            return prevMemo;
        });
    };
    
    // 배열을 덮어쓰기
    const replaceMemos = (newMemo: TMemo[]) => {
       setMemos(newMemo);
    };

 
    return { data, days, setDays: safeSetDays,replaceDays,appendDays, 
             memos, 
             setMemos: safeSetMemo,replaceMemos,
             status,
             bididx, attchfile, loading, error };
};

export default useFetchData;
