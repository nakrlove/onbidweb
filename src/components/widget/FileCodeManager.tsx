import React, {useCallback,useEffect, useState,useRef} from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import {CommonBody} from '../common/CommonBody';

import {RequestApi} from '../../components/fetchapi/FetchApi';


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
const FileCodeManager = () => {
    const [query, setQuery] = useState<{ [key: string]: any }>({});
    const fileCode = useRef<HTMLInputElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const doSubmit = useCallback(async(e: React.FormEvent) => {
        e.preventDefault();

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
        
        let newQuery = {};
        newQuery[`codename`] =  fileCode.current?.value;

        try{
          const data = await RequestApi(newQuery,"/api/onbid/regstcode",signal);
          console.log(JSON.stringify(data))

          if (data) {
              return;
          } 
     
          console.log('No addresses found or an error occurred.');
          
      } catch (err) {
        console.log('An error occurred while fetching addresses.');
      }

    },[fileCode])

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
        <Button variant="secondary" onClick={doSubmit}>등록하기</Button>
        {/* <Button variant="outline-secondary">Cancel</Button> */}
      </Stack>
    </CommonBody>)
}

export default FileCodeManager