import React from "react";

import { IItemRegst } from '../../components/model/regst'
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

const ItemRegst: React.FC<IItemRegst> = (props) =>{

    return<>
        <Row className="mb-3">
             <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>{props.viewInfo.textName1}</Form.Label>
                <Form.Control type="text" placeholder={props.viewInfo.placeholder1} 
                                value={props.value1}
                                onChange={props.onChange1} />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>{props.viewInfo.textName2}</Form.Label>
                <Form.Control type="text" placeholder={props.viewInfo.placeholder2} 
                                value={props.value2}
                                onChange={props.onChange2}
                                />
            </Form.Group>
        </Row>
    </>

}

export default ItemRegst;

