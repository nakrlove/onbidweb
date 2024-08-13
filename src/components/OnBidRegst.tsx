import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import './css/OnBidRegst.css'; // CSS 파일 import
import FindAddr from './modals/FindAddr';
import {handlePhoneNumberChange,handleNumberInputChange,handleKeyPress} from './utils/validationUtils'


const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const OnBidRegst = () => {
    const [address1, setAddress1] = useState('');
    // const [address2, setAddress2] = useState('');
    const [detailAddress, setDetailAddress] = useState('');
    const [roadNameAddress, setRoadNameAddress] = useState('');
    const [bankruptcyName, setBankruptcyName] = useState('');
    const [bankruptcyPhone, setBankruptcyPhone] = useState('');
    const [additionalFiles, setAdditionalFiles] = useState<{ id: number, file: File | null, selectedOption: string }[]>([{ id: 0, file: null, selectedOption: '' }]);

    const [bidmethod,setBidmethod]  = useState<{ sdate: string, edate: string , evalue: number,deposit: number }[]>([{ sdate: '', edate: '', evalue: 0,deposit: 0 }]);

    /* 감정가/보증금 */
    const [connoisseur , setConnoisseur]= useState('');
    const [selectsOptions, setSelectsOptions] = useState<{ idx: number, code: string, name: string }[]>([]);
    const [note, setNote] = useState('');
    const [memo, setMemo] = useState('');
    const [renter, setRenter] = useState(''); /* 임차여부 */
    const [land, setLand] = useState(''); /* 토지 */
    const [build, setBuild] = useState(''); /* 건축물 */
    const [estateType, setEstateType] = useState(''); /* 부동산종류 */
    const [disposal, setDisposal] = useState(''); /* 처분방식 */
    
    

    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태


    /* 주소검색 요청 팝업 */
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const doSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 파일 크기 확인
        for (const fileWrapper of additionalFiles) {
            if (fileWrapper.file && fileWrapper.file.size > MAX_FILE_SIZE) {
                alert(`File ${fileWrapper.file.name} exceeds 10MB limit`);
                return;
            }
        }

        // FormData 생성
        const formData = new FormData();
        formData.append('onbidDTO', new Blob([JSON.stringify({
            addr1: address1,
            detailAddress: detailAddress,
            roadNameAddress: roadNameAddress,
            bankruptcyName: bankruptcyName,
            bankruptcyPhone: bankruptcyPhone,
            note: note,     /* 유의사항*/
            memo: memo,
            renter: renter, /*임차여부*/
            land: land,     /*토지*/
            build: build,   /*건축물*/
            estateType: estateType, /* 부동산 종류*/
            disposal: disposal /* 처분방식*/
        })], { type: "application/json" }));

        // 파일과 옵션을 FormData에 추가
        additionalFiles.forEach((fileWrapper, index) => {
            if (fileWrapper.file) {
                formData.append(`additionalFiles`, fileWrapper.file);
                formData.append(`additionalFileOptions`, fileWrapper.selectedOption);
            }
        });


         formData.append('onbidDays', new Blob([JSON.stringify(bidmethod)], { type: 'application/json' }));
         // 입찰일자 /감정가/보증금

        // FormData 내용 확인
        formData.forEach((value, key) => {
            console.log(`${key}: ${value}`);
        });

        // 서버에 요청 보내기
        const URL = 'http://localhost:8080/api/onbid/onbidL';
        try {
            const response = await axios.post(URL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Form submitted successfully:', response.data);
        } catch (error) {
            console.error('Error submitting the form:', error);
        }
    };

    // 입력 값 변경 핸들러
    const handleInputChange = (index:number, event:React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        const newBidmethod = [...bidmethod];
        newBidmethod[index] = {
            ...newBidmethod[index],
            [name]: value,
        };
        console.log(JSON.stringify(newBidmethod))
        setBidmethod(newBidmethod);
    };

    const handleAdditionalFileChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = additionalFiles.map((fileWrapper, idx) => {
            if (index === idx) {
                return { ...fileWrapper, file: e.target.files ? e.target.files[0] : null };
            }
            return fileWrapper;
        });
        setAdditionalFiles(newFiles);
    };

    const handleSelectChange = (index: number) => (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newFiles = additionalFiles.map((fileWrapper, idx) => {
            if (index === idx) {
                return { ...fileWrapper, selectedOption: event.target.value };
            }
            return fileWrapper;
        });
        setAdditionalFiles(newFiles);
    };

    const addAdditionalFileInput = () => {
        setAdditionalFiles([...additionalFiles, { id: additionalFiles.length, file: null, selectedOption: '' }]);
    };

    /** 입찰일자/감정가/보증금 추가 */
    const addBidmethod = () => {
        setBidmethod([...bidmethod, { sdate: '', edate: '', evalue: 0,deposit: 0 }]);
    };
    
    /** 입찰일자/감정가/보증금 삭제 */
    const delBidmethod = (idx:number) => {
        const updatedBidmethod = bidmethod.filter((_, i) => i !== idx);
        setBidmethod(updatedBidmethod);
    };

    const fetchSelectOptions = useCallback(async () => {
        try {
            const response = await axios.post('/api/onbid/file-code');
            setSelectsOptions(response.data);
        } catch (error) {
            console.error('Error fetching select options:', error);
        }
    }, []);

    useEffect(() => {
        fetchSelectOptions();
    }, [fetchSelectOptions]);

    const selectAddress = (addr1: string | null | undefined, addr2: string) => {
        if (typeof addr1 === 'string' && addr1.trim() !== '') {
            setAddress1(addr1);
            setRoadNameAddress(addr2);
        }
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', textAlign: 'left' }}>
            <h2>정보 등록</h2>
            <form onSubmit={doSubmit}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                    <input
                        type="text"
                        value={address1}
                        onChange={(e) => setAddress1(e.target.value)}
                        placeholder="주소 입력"
                        style={{ flex: 1, marginRight: '10px', height: '30px' }} // Adjust height
                    />
                    <button type="button" onClick={toggleModal} className="btn-css">주소 검색</button> 
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <input
                        type="text"
                        value={detailAddress}
                        onChange={(e) => setDetailAddress(e.target.value)}
                        placeholder="상세 주소 입력"
                        style={{ width: '100%', marginBottom: '10px', height: '30px' }} // Adjust height
                    />
                    <input
                        type="text"
                        value={roadNameAddress}
                        readOnly={true}
                        placeholder="도로명 주소"
                        style={{ width: '100%', marginBottom: '10px', height: '30px' }} // Adjust height
                    />
                    <hr style={{ margin: '20px 0' }} />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label>파산관제인명</label>
                    <input
                        type="text"
                        value={bankruptcyName}
                        onChange={(e) => setBankruptcyName(e.target.value)}
                        placeholder="파산관제인명"
                        style={{ width: '100%', marginBottom: '10px', height: '30px' }} // Adjust height
                    />
                    <label>전화번호</label>
                    <input
                        type="text"
                        value={bankruptcyPhone}
                        onChange={(e) => handlePhoneNumberChange(e,setBankruptcyPhone)}
                        placeholder="전화번호"
                        style={{ width: '100%', marginBottom: '20px', height: '30px' }} // Adjust height
                    />
                </div>

                <div style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1px' }}>
                        <span>파일 첨부</span>
                        <button type="button" onClick={addAdditionalFileInput} className="btn-css">추가</button> {/* Adjust button height */}
                    </div>
                    <hr style={{ margin: '10px 0' }} />
                    {additionalFiles.map((fileWrapper, index) => (
                        <div key={fileWrapper.id} style={{ marginBottom: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                <select
                                    value={fileWrapper.selectedOption}
                                    onChange={handleSelectChange(index)}
                                    style={{ marginRight: '10px', height: '30px', width: '25%' }} // Adjust width
                                >
                                    <option value="">=선택=</option>
                                    {selectsOptions.map(item => (
                                        <option key={item.idx} value={item.code}>{item.name}</option>
                                    ))}
                                </select>
                                <input
                                    type="file"
                                    onChange={handleAdditionalFileChange(index)}
                                    style={{ height: '30px', width: '75%' }} // Adjust width
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <hr style={{ margin: '20px 0' }} />
                <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <span>처분방식</span>
                        <button type="button" className="btn-css">추가</button> {/* Adjust button height */}
                    </div>
                    <input
                        type="text"
                        onChange={(e) => setDisposal(e.target.value)}
                        placeholder="처분방식"
                        style={{ width: '100%', marginBottom: '10px', height: '30px' }} // Adjust height
                    />
                    <label>임차여부</label>
                    <input
                        type="text"
                        value={renter}
                        onChange={(e) => setRenter(e.target.value)}
                        placeholder="임차여부"
                        style={{ width: '100%', marginBottom: '10px', height: '30px' }} // Adjust height
                    />
                    <label>토지</label>
                    <input
                        type="text"
                        value={land}
                        onChange={(e) => setLand(e.target.value)}
                        placeholder="토지"
                        style={{ width: '100%', marginBottom: '10px', height: '30px' }} // Adjust height
                    />
                    <label>건축물</label>
                    <input
                        type="text"
                        value={build}
                        onChange={(e) => setBuild(e.target.value)}
                        placeholder="건축물"
                        style={{ width: '100%', marginBottom: '10px', height: '30px' }} // Adjust height
                    />
                    <label>부동산종류</label>
                    <input
                        type="text"
                        value={estateType}
                        placeholder="부동산종류"
                        style={{ width: '100%', marginBottom: '20px', height: '30px' }} // Adjust height
                    />
                </div>

                
                <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                        <span>입찰일자</span>
                        <button type="button" className="btn-css" onClick={addBidmethod}> + </button>
                    </div>
                  

                    {bidmethod.map((item,index) => (
                        <div key={index}>
                            <hr style={{ margin: '10px 0' }} />
                            <input
                                type="text"
                                value={item.sdate || ''}
                                name={`sdate`} 
                                placeholder="입찰 시작일"
                                onChange={(e) => handleInputChange(index,e)}
                                style={{ width: '48%', marginRight: '4%', height: '30px' }} 
                            />
                            <input
                                type="text"
                                value={item.edate || ''}
                                name={`edate`} 
                                placeholder="입찰 종료일"
                                onChange={(e) => handleInputChange(index,e)}
                                style={{ width: '48%', height: '30px' }} 
                            />
    
                            <div style={{ display: 'flex', alignItems: 'center',marginTop: '10px', marginBottom: '1px' }}>
                                <span>감정가 / 보증금</span>
                                <button type="button" className="btn-css" onClick={() => delBidmethod(index)}> - </button>
                            </div>
                     
                            <input
                                type="text"
                                value={item.evalue || ''}
                                name={`evalue`}
                                placeholder="감정가"
                                onChange={(e) => handleInputChange(index,e)}
                                style={{ width: '48%', marginRight: '4%', height: '30px' }} 
                            />
                             <input
                                type="text"
                                value={item.deposit || ''}
                                name={`deposit`}
                                placeholder="보증금"
                                onChange={(e) => {handleInputChange(index,e)}}
                                style={{ width: '48%', height: '30px' }} // Adjust height
                            />
                        </div>
                        ))}

                </div>
                
           
                <hr style={{ margin: '20px 0' }} />

                <div style={{ marginBottom: '20px' }}>
                    <label>유의사항</label>
                    <CKEditor
                        editor={ClassicEditor}
                        data={note}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            setNote(data);
                        }}
                        config={{
                            toolbar: [
                                'undo', 'redo', '|',
                                'bold', 'italic', 'underline', 'strikethrough', '|',
                                'fontColor', 'fontBackgroundColor', '|',
                                'link', '|',
                                'numberedList', 'bulletedList', '|',
                                'alignment', '|',
                                'insertTable', 'blockQuote', 'codeBlock', '|',
                                'mediaEmbed', 'imageUpload', 'removeFormat'
                            ],
                        }}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label>메모</label>
                    <CKEditor
                        editor={ClassicEditor}
                        data={memo}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            setMemo(data);
                        }}
                        config={{
                            toolbar: [
                                'undo', 'redo', '|',
                                'bold', 'italic', 'underline', 'strikethrough', '|',
                                'fontColor', 'fontBackgroundColor', '|',
                                'link', '|',
                                'numberedList', 'bulletedList', '|',
                                'alignment', '|',
                                'insertTable', 'blockQuote', 'codeBlock', '|',
                                'mediaEmbed', 'imageUpload', 'removeFormat'
                            ],
                        }}
                    />
                </div>

                <button type="submit" className='btn-submit'>
                    제출
                </button>
            
                {/* <FindAddr isOpen={isModalOpen} onClose={toggleModal} /> */}
            </form>
            <FindAddr
                show={isModalOpen}
                onHide={() => toggleModal()}
                onSelect={selectAddress}
            />
        </div>
    );
};

export default OnBidRegst;
