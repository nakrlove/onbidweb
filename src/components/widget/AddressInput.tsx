import React from "react";

import { IAddressRegst } from '../../components/model/regst'
import 'bootstrap/dist/css/bootstrap.min.css';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

const AddressInput: React.FC<IAddressRegst> = (props) =>{

        return <>
            <InputGroup className="mb-1">
                <Form.Control
                            placeholder={props.placeholder}
                            value={props.value1}
                            onChange={props.onChange1}
                            aria-label="Recipient's username"
                            aria-describedby="basic-addon2"  />
                <Button variant="outline-secondary" id="button-addon2">조회</Button>
            </InputGroup>
            <InputGroup className="mb-3">
                <Form.Control
                    placeholder="상세주소"
                    id="inputPassword5"
                    value={props.value2}
                    onChange={props.onChange2}
                    aria-describedby="passwordHelpBlock"
                />
            </InputGroup>

        </>
 
}

export default AddressInput;