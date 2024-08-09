import React, {useCallback,useEffect, useState,useRef} from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import {CommonBody} from '../common/CommonBody';

import {RequestApi} from '../fetchapi/FetchApi';
import { useNavigate,useLocation } from 'react-router-dom';

// FormData 객체를 URL 쿼리 문자열로 변환
const formDataToQueryString = (formData: FormData): string => {
  const queryString: string[] = [];
  formData.forEach((value, key) => {
    if (value instanceof File) {
      // File 객체는 쿼리 문자열에 포함할 수 없으므로, 예를 들어 파일 이름을 포함하도록 할 수 있습니다.
      queryString.push(`${encodeURIComponent(key)}=${encodeURIComponent(value.name)}`);
    } else {
      queryString.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    }
  });
  return queryString.join('&');
};

/**
 * 첨부파일 코드관리
 */
const CodeRegist = () => {
    const [query, setQuery] = useState<{ [key: string]: any }>({});
    const [btnname, setBtnname] = useState("등록하기");
    const fileCode = useRef<HTMLInputElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const navigate = useNavigate(); // useNavigate 훅 사용

    //파라메터 넘겨받기 시작 
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const paramData = queryParams.get('data');
    // let newQuery = {};

    useEffect(() => {
      if (paramData) {
          try {
              const parsedData = JSON.parse(paramData);
              if (parsedData.codename && fileCode.current) {
                  fileCode.current.value = parsedData.codename;
                  let newQuery = {...query}
                  newQuery[`idx`] = parsedData.idx
                  setQuery(newQuery)
                  setBtnname("수정하기")
              }
          } catch (error) {
              console.error('Failed to parse JSON data from query string:', error);
          }
      }
    }, [paramData]);

    //파라메터 넘겨받기 끝 
    const doSubmit = useCallback(async(e: React.FormEvent) => {
        e.preventDefault();

        if (!fileCode.current || !fileCode.current.value.trim()) {
          alert("코드명을(를) 입력해주세요.");
          return;
        }

        const formData = new FormData();
        formData.append('filecode', fileCode.current.value);

          // 이전 요청을 취소합니다.
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            //return;
        }

        const abortController = new AbortController();
        const signal = abortController.signal;
        abortControllerRef.current = abortController;
        console.log(`btnname check ${btnname}`)
        let newUrl = btnname === '등록하기' ? "/api/onbid/regstcode" : "/api/onbid/updatecode";
        let method = btnname === '등록하기' ? "POST" : "PUT";
        try{

          let newQuery = {...query}
          newQuery[`codename`] =  fileCode.current?.value

          const data = await RequestApi(newUrl,method,newQuery,signal);
          console.log(JSON.stringify(data))

          if (data) {
              const userConfirmed = window.confirm('정상처리 되었습니다. 목록으로 이동하시겠습니까?');
              if (userConfirmed) {
                navigate('/file-code'); // 목록화면으로 이동
              }
              return;
          } 
     
          console.log('No addresses found or an error occurred.');
            
        } catch (err) {
          console.log('An error occurred while fetching addresses.');
        }

    },[fileCode,btnname,query])

    return (<CommonBody>
       <InputGroup className="mb-3">
        <InputGroup.Text id="basic-addon1">첨부코드</InputGroup.Text>
        <Form.Control
          ref={fileCode}
          placeholder="첨부되는 파일코드"
          aria-label="filecode"
          aria-describedby="basic-addon1"
        />
      </InputGroup>
      <Stack gap={2} className="col-md-5 mx-auto">
        <Button variant="secondary" onClick={doSubmit}>{btnname}</Button>
        {/* <Button variant="outline-secondary">Cancel</Button> */}
      </Stack>
    </CommonBody>)
}

export default CodeRegist