import ItemRegst from '../../src/components/widget/ItemRegst';
import AddressInput from '../../src/components/widget/AddressInput';

import React, {useEffect, useState} from 'react';
import styled, { css } from "styled-components";
// import Header from './widget/Header';
import 'bootstrap/dist/css/bootstrap.min.css';
// import Form from 'react-bootstrap/Form';
import FileInput from './widget/FileInput';
// import Button from 'react-bootstrap/Button';

import { Form, Button } from 'react-bootstrap';
import axios from 'axios';


const ViewRegst = () => {

 
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [bankruptcyName, setBankruptcyName] = useState('');
    const [bankruptcyPhone, setBankruptcyPhone] = useState('');
    const [file, setFile] = useState<File | null>(null);
    // const [additionalFile, setAdditionalFile] = useState<File | null>(null);
    const [additionalFiles, setAdditionalFiles] = useState<File[]>([]);
    // useEffect(() => {
    //     console.log(address1);
    //     console.log(address2);
    //     console.log(bankruptcyName);
    //     console.log(bankruptcyPhone);

    // },[address1,address2,bankruptcyName,bankruptcyPhone])

    useEffect(() => {
        console.log(address1);
        console.log(address2);
        console.log(bankruptcyName);
        console.log(bankruptcyPhone);

    },[])

    const doSubmit = async (e: React.FormEvent)=> {
        e.preventDefault();
        const formData = new FormData();
        formData.append("address1", address1);
        formData.append("address2", address2);
        formData.append("bankruptcyName", bankruptcyName);
        formData.append("bankruptcyPhone", bankruptcyPhone);

        if (file) {
            formData.append('file', file);
        }

        additionalFiles.forEach((value,key) => {
            formData.append('file'+key, value);
        });
        formData.forEach((value, key) => {
            console.log(`${key}: ${value}`);
        });

        // Log FormData content
        // for (let [key, value] of formData.entries()) {
        //     console.log(`${key}: ${value}`);
        // }
       
        /*
        try {
            const response = await axios.post('/your-endpoint', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Form submitted successfully:', response.data);
        } catch (error) {
            console.error('Error submitting the form:', error);
        }
        */
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };


    const handleAdditionalFileChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = [...additionalFiles];
        if (e.target.files) {
            newFiles[index] = e.target.files[0];
            setAdditionalFiles(newFiles);
        }
    };

    const addAdditionalFileInput = () => {
        setAdditionalFiles([...additionalFiles, new File([], "")]);
    };


    return (<>
        {/* <div className='bd-item-regst'> */}
       
        <BodyLine>
            <header>정보등록</header>
            <Form onSubmit={doSubmit}>
                <AddressInput placeholder={"주소"} 
                              value1={address1}
                              value2={address2}
                              onChange1={(e) => setAddress1(e.target.value)}
                              onChange2={(e) => setAddress2(e.target.value)}/>

                <ItemRegst
                           viewInfo={{
                                "textName1": "파산관제인명",
                                "textName2": "파산관제인 전화번호",
                                "placeholder1": "파산관제인명",
                                "placeholder2": "파산관제인 전화번호",
                           }}     
                           value1={ bankruptcyName }    
                           value2={ bankruptcyPhone }   
                           onChange1={(e) => setBankruptcyName(e.target.value)}
                           onChange2={(e) => setBankruptcyPhone(e.target.value)} 
                           label={"파산관제인명"}
                           placeholder={"파산관제인명"} />

              
                <FileInput label="매각공고" file={file} handleFileChange={handleFileChange}/>
               
                <Form.Group controlId="additionalFiles" className="mb-3">
                    <Form.Label>추가 파일 첨부</Form.Label>
                    {additionalFiles.map((file, index) => (
                        <Form.Control
                            key={index}
                            type="file"
                            onChange={handleAdditionalFileChange(index)}
                        />
                    ))}
                    <Button variant="secondary" onClick={addAdditionalFileInput}>추가</Button>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
         </BodyLine>
        </>
    );
}

export default ViewRegst;


const BodyLine = styled.div`
     padding: 1.5rem;
    position: relative;
    margin-right: 50;
    margin-left: 50;
    border-width: 1rem;
    margin: 1.5rem 150px 0;
    border: solid #f7f7f9;
   
`;
