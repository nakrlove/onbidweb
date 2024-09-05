import React from "react";
import Form from 'react-bootstrap/Form';
import { IFileInput } from "../interface/regst";

const FileInput : React.FC<IFileInput> =(props) =>{

    return <div className="header">
      <Form.Group controlId="formFile" className="mb-1">
        <Form.Label>{props.label}</Form.Label>
        <Form.Control type="file" onChange={props.handleFileChange}/>
      </Form.Group>
</div>
}

export default FileInput;