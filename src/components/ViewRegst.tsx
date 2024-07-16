import ItemRegst from '../../src/components/widget/ItemRegst';
import React from 'react';
import styled, { css } from "styled-components";
import Header from './widget/Header';
// import "../css/common1.css";

const ViewRegst = () => {
    return (
        // <div className='bd-item-regst'>
       
        <BodyLine>
            <header>정보등록</header>
            <form >
                <ItemRegst label={"주소"}
                    placeholder={"주소를 선택하세요"} />

                <ItemRegst label={"파산관제인명"}
                    placeholder={"파산관제인명"} />

                <ItemRegst label={"파산관제인 전화번호"}
                    placeholder={"파산관제인 전화번호"} />
            </form>
        </BodyLine>
    );
}

export default ViewRegst;


const BodyLine = styled.div`
     padding: 1.5rem;
    position: relative;
    margin-right: 0;
    margin-left: 0;
    border-width: 1rem;
    margin: 1rem -15px 0;
    border: solid #f7f7f9;
   
`;
