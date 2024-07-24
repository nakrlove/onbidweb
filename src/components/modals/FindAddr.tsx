import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import findaddr from '../../components/fetchapi/FetchApi'

export default function FindAddr(props) {

    const [address,setAddress] = useState([])
    const [query, setQuery] = useState('');
    const [error, setError] = useState(null);
    const handleSearch = async (e: React.FormEvent, query: String) => {
        e.preventDefault();
        try {

            console.log(query);

            // if(true) return;
            const data = await findaddr(query);
            if (data) {
                setAddress(data);
                return;
            } 
             setError('No addresses found or an error occurred.');
            
        } catch (err) {
             setError('An error occurred while fetching addresses.');
        }
    };
    return (
        <Modal {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                    주소검색
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                        <Container>
                            <div>
                                <li>정확한 주소를 모르시는 경우
                                    <ul className="v2">
                                        <li className="w_230">시/군/구 + 도로명, 동명 또는 건물명<br/>
                                        예) 동해시 중앙로, 여수 중앙동, 대전 현대아파트
                                        </li>
                                    </ul>
                                </li>
                            </div>
                            <div>
                                <li>정확한 주소를 아시는 경우
                                    <ul className="v2">
                                        <li className="w_230">도로명 + 건물번호 예) 종로 6</li>
                                        <li className="w_230">읍/면/동/리 + 지번 예) 서린동 154-1</li>
                                    </ul>
                                </li>
                            </div>
                        </Container>


                        <InputGroup className="mb-1">
                            <Form.Control
                                        placeholder="주소검색"
                                        // value={props.query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        aria-label="Recipient's username"
                                        aria-describedby="basic-addon2"  />
                            <Button variant="outline-secondary" id="button-addon2" onClick={ (e) => handleSearch(e,query) } >조회</Button>
                        </InputGroup>

                        {error && <p>{error}</p>}


                        {/* <ul>
                            {address.map((addr, index) => (
                                <li key={index}>{addr}</li>
                            ))}
                        </ul> */}

                        <ListGroup as="ol" numbered>

                
                            <ListGroup.Item
                                as="li"
                                className="d-flex justify-content-between align-items-start"
                            >
                                  {address.map((addr, index) => (
                                    <div key={index}>
                                            {addr}
                                            <div > Cras justo onbidDTO</div>
                                    </div>
                                     
                                    ))}
            
                            </ListGroup.Item>
                          
                        </ListGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={props.onHide}>Close</Button>
                </Modal.Footer>
        </Modal>
    );
}