import React from "react";
import  "../../css/common1.css";
import { IItemRegst } from '../../components/model/regst'


const ItemRegst: React.FC<IItemRegst> = (props) =>{

    return <>

        <div className="form-group">
            <label htmlFor="exampleInputEmail1" 
                   className="text-left">{props.label}</label>
            <input type="email" 
                   className="form-control"
                   id="exampleInputEmail1" 
                   aria-describedby="emailHelp" 
                   placeholder={props.placeholder} />
            <small id="emailHelp" 
                   className={`'form-text text-muted'`}>
                    {/* We'll never share your email with anyone else. */}
                    {props.message}
            </small>
        </div>

    </>
   
}

export default ItemRegst;

