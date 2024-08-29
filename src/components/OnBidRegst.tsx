import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 임포트
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import './css/OnBidRegst.css'; // CSS 파일 import

import { useCategory } from './provider/CategoryProvider'; // Context 사용
import FindAddr from './modals/FindAddr';
import Category from './modals/Categroy';
import { handlePhoneNumberChange, handleNumberInputChange, handleKeyPress } from './utils/validationUtils';



import styled from 'styled-components';

import plus from '../assets/plus.png'; // 경로는 파일의 위치에 따라 조정
import plus1 from '../assets/plus-1.png'; // 경로는 파일의 위치에 따라 조정
import minus from '../assets/minus.png'; // 경로는 파일의 위치에 따라 조정
import edit from '../assets/edit.png'; // 경로는 파일의 위치에 따라 조정
import search from '../assets/search.png'; // 경로는 파일의 위치에 따라 조정
import UIButton from './ui/UIButton';




const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

interface Code {
    idx: number;
    code: string;
    name: string;
}

const Image = styled.img`
width: 20px;
height: 20px;
`;


interface Category{ idx: number; content: string; user: string; regdate: string }

const OnBidRegst = () => {
    
    const [address1         , setAddress1]         = useState('');
    const [detailAddress    , setDetailAddress]    = useState('');
    const [rdaddr           , setRdaddr]           = useState('');
    const [bruptcyAdminName , setBruptcyAdminName] = useState('');
    const [bruptcyAdminPhone, setBruptcyAdminPhone]= useState('');
    const [additionalFiles  , setAdditionalFiles]  = useState<{ id: number, file: File | null, selectedOption: string }[]>([{ id: 0, file: null, selectedOption: '' }]);
    const [bidMethod        , setBidMethod]        = useState<{  edate: string, evalue: number, deposit: number }[]>([{ edate: '', evalue: 0, deposit: 0 }]);

    // const [connoisseur, setConnoisseur] = useState('');
    const [selectsOptions, setSelectsOptions] = useState<Code[]>([]);
    const [note          , setNote]           = useState('');
    const [memo          , setMemo]           = useState('');
    const [renter        , setRenter]         = useState('');
    const [ld_area         , setLdarea]         = useState('');
    const [ld_area_memo    , setLdareamemo]     = useState(''); //토지면적 메모
    const [build_area      , setBuildarea]      = useState('');
    const [build_area_memo , setBuildareamemo]  = useState(''); //건물면적 메모
    const [estateTypes     , setEstateTypes]    = useState<Code[]>([]);
    const [other_laws      , setOtherLaws]      = useState('');             //다른 법령 등에 따른 지역ㆍ지구등
    const [enforcement_decree                , setEnforcementdecree] = useState('');  //시행령
    const [national_land_planning_use_laws   , setNationalLandPlanningUseLaws] = useState(''); //「국토의 계획 및 이용에 관한 법률」에 따른 지역ㆍ지구등
    
    
     // 하나의 선택된 부동산 종류를 관리하는 상태 변수
     const [selectedEstateType, setSelectedEstateType] = useState<Code['code']>('');

    const [disposaltype  , setDisposaltype]   = useState('');
    const [debtor        , setDebtor]         = useState(''); /* 채무자명 */
    
    const [land_classification, setLandclassification] = useState(''); /* 지목 */
    const [land_classification_array, setLandclassificationarray] = useState<Code[]>([]); /* 지목 */
    const [progress_status, setProgressstatus] = useState(''); /* 진행상태*/


    const [onbid_status, setOnbidStatus] = useState(''); /* 지목 */
    const [categorystatus, setCategoryStatus] = useState(''); /* 관심종목 */
    //const [category,setCategory] = useState<Category[]>([]); /* 관심목록 */
    /* 입찰진행상태*/
    const [onbidStatusArray,setOnbidStatusArray] = useState<Code[]>([]); /* 진행상태 */

    // Validation States
    const [errors, setErrors] = useState({
        address1         : '',
        detailAddress    : '',
        bruptcyAdminName : '',
        bruptcyAdminPhone: '',
        Disposaltype: '',
        ld_area      : ''    ,
        ld_area_memo  : ''    ,
        build_area   : ''    ,
        build_area_memo   : ''    ,
        estateType  : ''    , /* 부동산종류 */
        selectedOption: '',
        file        : '',
        sdate       : '',
        edate       : '',
        evalue      : '',
        deposit     : '',
        disposal_type: '',
        land_classification: '',
        progress_status:   '',
        onbid_status:      '',
        onbidStatusArray:'',
        debtor      :      '', //채무자명
        national_land_planning_use_laws : '', //「국토의 계획 및 이용에 관한 법률」에 따른 지역ㆍ지구등
        other_laws  :      '',   //다른 법령 등에 따른 지역ㆍ지구등
        enforcement_decree: '', //시행령
        idx: 0 , //관심종목 '0' 전체
    });

    const { categories, setCategories } = useCategory(); //provier 적용
    const navigate = useNavigate(); // useNavigate 훅 사용

    const [isAddrModalOpen, setIsAddrModalOpen] = useState(false); // 모달 열림 상태
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false); // 모달 열림 상태
    /* 주소검색 요청 팝업 */
    const toggleAddrModal = (e: React.MouseEvent<HTMLElement,MouseEvent>) => {
        e.preventDefault(); // 기본 폼 제출 방지
        e.stopPropagation();
        setIsAddrModalOpen(prev => !prev);
    };
   
    const toggleCategoryModal = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault(); // 기본 폼 제출 방지
        e.stopPropagation();
        setIsCategoryModalOpen(prev => !prev);
    };

    const validateForm = () => {
        const newErrors: any = {};
        let isValid = true;

        if (!address1) {
            newErrors.address1 = '주소 입력이 필요합니다.';
            isValid = false;
        }

        if (!detailAddress) {
            newErrors.detailAddress = '상세 주소 입력이 필요합니다.';
            isValid = false;
        }

        if (!bruptcyAdminName) {
            newErrors.bruptcyAdminName = '파산관제인명 입력이 필요합니다.';
            isValid = false;
        }

        if (!bruptcyAdminPhone) {
            newErrors.bruptcyAdminPhone = '전화번호 입력이 필요합니다.';
            isValid = false;
        }

        if (additionalFiles.some(fileWrapper => !fileWrapper.file)) {
            newErrors.file = '파일이 필요합니다.';
            isValid = false;
        }

        if (!disposaltype) {
            newErrors.Disposaltype = '처분방식 입력이 필요합니다.';
            isValid = false;
        }

        if (!ld_area) {
            newErrors.ldarea = '토지 입력이 필요합니다.';
            isValid = false;
        }

        if (!build_area) {
            newErrors.buildarea = '건축물 입력이 필요합니다.';
            isValid = false;
        }

        if (!debtor) {
            newErrors.debtor = '채무자명 입력이 필요합니다.';
            isValid = false;
        }

           

        if (!selectedEstateType) {
            newErrors.estateType = '부동산 종류 선택이 필요합니다.';
            isValid = false;
        }

     
        bidMethod.forEach((item, index) => {
           
            if (!item.edate) {
                newErrors[`edate`] = '입찰일자 입력이 필요합니다.';
                isValid = false;
            }

            if (!item.evalue && item.evalue === 0) {
                // newErrors[`evalue`] = '감정가 입력이 필요합니다.';
                newErrors[`deposit`] = '감정가 입력이 필요합니다.';
                isValid = false;
            }

            if (!item.deposit && item.deposit === 0) {
                newErrors[`deposit`] = '보증금 입력이 필요합니다.';
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const doSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

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
            addr1: address1                       ,
            detailAddress: detailAddress          ,
            rd_addr: rdaddr                       ,
            bruptcy_admin_name: bruptcyAdminName  ,
            bruptcy_admin_phone: bruptcyAdminPhone,
            note: note                            ,
            memo: memo                            ,
            renter: renter                        ,
            ld_area: ld_area                       ,
            ld_area_memo: ld_area_memo                ,
            build_area: build_area                 ,
            build_area_memo: build_area_memo          ,
            estateType: selectedEstateType        ,
            disposal_type: disposaltype           ,
            land_classification:land_classification,
            progress_status: progress_status      ,
            onbid_status: onbid_status            ,
            debtor: debtor                        ,
            national_land_planning_use_laws: national_land_planning_use_laws,
            other_laws: other_laws                ,
            enforcement_decree: enforcement_decree,
            idx: categorystatus  , //관심종목 
        })], { type: "application/json" }));

        // 파일과 옵션을 FormData에 추가
        additionalFiles.forEach((fileWrapper, index) => {
            if (fileWrapper.file) {
                formData.append(`additionalFiles`, fileWrapper.file);
                formData.append(`additionalFileOptions`, fileWrapper.selectedOption);
            }
        });

        formData.append('onbidDays', new Blob([JSON.stringify(bidMethod)], { type: 'application/json' }));

        // FormData 내용 확인
        formData.forEach((value, key) => {
            console.log(`${key}: ${JSON.stringify(value)}`);
        });

       
        // 서버에 요청 보내기
        //const URL = `${process.env.REACT_APP_API_URL}/api/onbid/onbidL`;
        const URL = `${process.env.REACT_APP_API_URL}/api/onbid/onBidRegist`;
        try {
            const response = await axios.post(URL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Form submitted successfully:', response.data);
            navigate('/onbid-list', { replace: true }); // 목록화면으로 이동 
        } catch (error) {
            console.error('Error submitting the form:', error);
        }
    };

    // 입력 값 변경 핸들러
    const handleInputChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        const newBidmethod = [...bidMethod];
        newBidmethod[index] = {
            ...newBidmethod[index],
            [name]: value,
        };
        setBidMethod(newBidmethod);
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

    /* 파일첨부 종류선택 */
    const handleSelectChange = (index: number) => (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newFiles = additionalFiles.map((fileWrapper, idx) => {
            if (index === idx) {
                return { ...fileWrapper, selectedOption: event.target.value };
            }
            return fileWrapper;
        });
        setAdditionalFiles(newFiles);
    };

    /* 지목선택 */
    const landSelectChange = (index: number) => (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newFiles = land_classification_array.map((fileWrapper, idx) => {
            if (index === idx) {
               setLandclassification(fileWrapper.code)
            }
            return fileWrapper.code;
        });
        // setAdditionalFiles(newFiles);
    };

    /* 관심종목 선택 */
    const categorySelectChange = (value: string) => {
        setCategoryStatus(value)
    };


    // 부동산 종류 선택 핸들러
    const handleEstateTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;

         // allEstateTypes 배열에서 value에 해당하는 객체 찾기
        const selectedType = estateTypes.find(type => type.code === value);

        if (selectedType) {
            // value에 해당하는 객체가 없으면 종료
            setSelectedEstateType(selectedType.code); // 선택된 객체로 상태 업데이트
            return;
        }
        // const updatedEstateType = estateTypes.find(type => type.code === value)
        //     ? estateTypes.filter(type => type.code !== value) // 이미 선택된 경우 제거
        //     : [...estateTypes, value]; // 선택되지 않은 경우 추가
       // setEstateTypes(updatedEstateType);
    };

    const addAdditionalFileInput = () => {
        setAdditionalFiles([...additionalFiles, { id: additionalFiles.length, file: null, selectedOption: '' }]);
    };

    /** 입찰일자/감정가/보증금 추가 */
    const addBidmethod = () => {
        setBidMethod([...bidMethod, {  edate: '', evalue: 0, deposit: 0 }]);
    };

    /** 입찰일자/감정가/보증금 삭제 */
    const delBidmethod = (idx: number) => {
        const updatedBidmethod = bidMethod.filter((_, i) => i !== idx);
        setBidMethod(updatedBidmethod);
    };

    const initfetchSelectOptions = useCallback(async () => {

        /* 파일첨부 코드조회 */
        try {
            const response = await axios.post('/api/onbid/file-code');
            setSelectsOptions(response.data);
        } catch (error) {
            console.error('Error fetching select options:', error);
        }

        /* 지목 */
        try {
            const response = await axios.post('/api/onbid/file-code?codes=003');
            setLandclassificationarray(response.data);
        } catch (error) {
            console.error('Error fetching select options:', error);
        }

        /* 입찰진행상태 */
        try {
            const response = await axios.post('/api/onbid/file-code?codes=037');
            setOnbidStatusArray(response.data);
        } catch (error) {
            console.error('Error fetching select options:', error);
        }

        /* 부동산종류 */
        try {
            const response = await axios.post('/api/onbid/file-code?codes=044');
            setEstateTypes(response.data);
        } catch (error) {
            console.error('Error fetching select options:', error);
        }


        /* 관심목록 */
       
        try {
            const response = await axios.post('/api/onbid/categroyList');
            //setCategory(response.data);
            setCategories(response.data)
        } catch (error) {
            console.error('Error fetching select options:', error);
        }
     
        
    }, []);

    useEffect(() => {
        initfetchSelectOptions();
    }, [initfetchSelectOptions]);

    const selectAddress = (addr1: string | null | undefined, addr2: string) => {
        if (typeof addr1 === 'string' && addr1.trim() !== '') {
            setAddress1(addr1);
            setRdaddr(addr2);
        }
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', textAlign: 'left' }}>
            <h2>정보 등록</h2>
            <form onSubmit={doSubmit}>
                
                <div style={{ display: 'flex', alignItems: 'left', marginBottom: '0px' }}>
                    <label style={{ marginBottom: '10px',marginRight: '1px', height: '30px', width: '10%' }}>진행상태</label>
                    <select onChange={(e) => setOnbidStatus(e.target.value)}
                                style={{ marginBottom: '10px',marginRight: '10px', height: '30px', width: '25%' }}>
                                    <option value="">=선택=</option>
                                    {onbidStatusArray?.map(item => (
                                        <option key={item.idx} value={item.code}>{item.name}</option>
                                    ))}
                    </select>
                

                    <label style={{ marginBottom: '10px',marginLeft: '10px', height: '30px', width: '10%' }}>채무자명</label>
                    <input
                        type="text"
                        value={debtor}
                        onChange={(e) => setDebtor(e.target.value)}
                        placeholder="채무자명"
                        style={{ flex: 1, height: '30px' }}
                    />
                </div>
                {errors.debtor && <div style={{ color: 'red', marginTop: '-20px',marginBottom: '10px' }}>{errors.debtor}</div>}
                <hr style={{ margin: '2px 0' }} />
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                    <input
                        type="text"
                        value={address1}
                        onChange={(e) => setAddress1(e.target.value)}
                        placeholder="주소 입력"
                        style={{ flex: 1, marginRight: '10px', height: '30px' }}
                    />
                    <button type="button" onClick={toggleAddrModal} style={{ width: '22%', textAlign: 'center',border: '1px solid #ddd' }}>
                        <Image src={search} alt="search"/> 주소 검색
                    </button>
                    
                </div>
                {errors.address1 && <div style={{ color: 'red', marginTop: '-20px',marginBottom: '10px' }}>{errors.address1}</div>}
                <div style={{ marginBottom: '20px' }}>
                    <input
                        type="text"
                        value={detailAddress}
                        onChange={(e) => setDetailAddress(e.target.value)}
                        placeholder="상세 주소 입력"
                        style={{ width: '100%', marginBottom: '10px', height: '30px' }}
                    />
                    {errors.detailAddress && <div style={{ color: 'red', marginTop: '-10px',marginBottom: '10px' }}>{errors.detailAddress}</div>}
                    <input
                        type="text"
                        value={rdaddr}
                        readOnly={true}
                        placeholder="도로명 주소"
                        style={{ width: '100%', marginBottom: '10px', height: '30px' }}
                    />
                    <hr style={{ margin: '20px 0' }} />
                </div>


                <div style={{ marginBottom: '3px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '-4px' }}>
                        <span style={{ width: '30%',marginRight: '5%'}}>입찰일자</span>
                        <span >감정가/보증금</span>
                        <button type="button" className="btn-css register-button" onClick={addBidmethod}> 
                            <Image src={plus1} alt="Add"/>
                        </button>
                    </div>
                    <hr style={{ margin: '4px 0' }} />
                    {bidMethod.map((item, index) => (
                        <div key={index}>
                           
                            <div style={{ display: 'flex' }}>
                                {/* <input
                                    type="date"
                                    value={item.sdate || ''}
                                    name={`sdate`}
                                    placeholder="입찰 시작일"
                                    onChange={(e) => handleInputChange(index, e)}
                                    onKeyDown={(e) => e.preventDefault()} // Prevent direct typing
                                    style={{ width: '43%', marginRight: '4%', height: '30px' }}
                                /> */}
                                {/* {errors[`sdate`] && <div style={{ color: 'red', marginBottom: '1px' }}>{errors[`sdate`]}</div>} */}
                                <input
                                    type="date"
                                    value={item.edate || ''}
                                    name={`edate`}
                                    placeholder="입찰 종료일"
                                    onChange={(e) => handleInputChange(index, e)}
                                    onKeyDown={(e) => e.preventDefault()} // Prevent direct typing
                                    style={{ width: '30%',marginRight: '5%', height: '30px' }}
                                />
                                
                                <input
                                    type="text"
                                    value={item.evalue || ''}
                                    name={`evalue`}
                                    placeholder="감정가"
                                    onChange={(e) => handleInputChange(index, e)}
                                    style={{ width: '30%', marginRight: '0.5%', height: '30px' }}
                                />
                                <input
                                    type="text"
                                    value={item.deposit || ''}
                                    name={`deposit`}
                                    placeholder="보증금"
                                    onChange={(e) => handleInputChange(index, e)}
                                    style={{ width: '30%',  marginRight: '1%',height: '30px' }}
                                />
                                <button type="button" className="btn-css register-button" onClick={() => delBidmethod(index)}>
                                    <Image src={minus} alt="Minus"/>    
                                </button>
                            </div>
                            {errors[`edate`] && <div style={{ color: 'red', marginTop: '-2px',marginBottom: '10px' }}>{errors[`edate`]}</div>}
                            {errors[`deposit`] && <div style={{ color: 'red',  marginTop: '-2px',marginBottom: '10px' }}>{errors[`deposit`]}</div>}
                        </div>
                    ))}
                </div>

                <hr style={{ margin: '10px 0' }} />

                <div style={{ marginBottom: '20px' }}>
                    <label>파산관제인명</label>
                    <input
                        type="text"
                        value={bruptcyAdminName}
                        onChange={(e) => setBruptcyAdminName(e.target.value)}
                        placeholder="파산관제인명"
                        style={{ width: '100%', marginBottom: '10px', height: '30px' }}
                    />
                    {errors.bruptcyAdminName && <div style={{ color: 'red', marginTop: '-10px',marginBottom: '10px' }}>{errors.bruptcyAdminName}</div>}

                    <label>전화번호</label>
                    <input
                        type="text"
                        value={bruptcyAdminPhone}
                        onChange={(e) => handlePhoneNumberChange(e, setBruptcyAdminPhone)}
                        placeholder="전화번호"
                        style={{ width: '100%', marginBottom: '20px', height: '30px' }}
                    />
                    {errors.bruptcyAdminPhone && <div style={{ color: 'red', marginTop: '-20px',marginBottom: '10px' }}>{errors.bruptcyAdminPhone}</div>}
                </div>
                <hr style={{ margin: '10px 0' }} />
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

                <hr style={{ margin: '10px 0' }} />

                <div style={{ marginBottom: '2px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '-9px' }}>
                        <span>파일 첨부</span>
                        <button type="button" onClick={addAdditionalFileInput} className="btn-css register-button">
                            <Image src={plus} alt="Add"/>
                        </button>
                    </div>
                    <hr style={{ margin: '10px 0' }} />
                    {additionalFiles.map((fileWrapper, index) => (
                        <div key={fileWrapper.id} style={{ marginBottom: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                <select
                                    value={fileWrapper.selectedOption}
                                    onChange={handleSelectChange(index)}
                                    style={{ marginRight: '10px', height: '30px', width: '25%' }}
                                >
                                    <option value="">=선택=</option>
                                    {selectsOptions?.map(item => (
                                        <option key={item.idx} value={item.code}>{item.name}</option>
                                    ))}
                                </select>
                                <input
                                    type="file"
                                    onChange={handleAdditionalFileChange(index)}
                                    style={{ height: '30px', width: '75%' }}
                                />
                            </div>
                        </div>
                    ))}
                    {/* {errors.file && <div style={{ color: 'red', marginBottom: '10px' }}>{errors.file}</div>} */}
                </div>
                <hr style={{ margin: '20px 0' }} />
                <div style={{ marginBottom: '20px' }}>
                    <input
                        type="text"
                        value={disposaltype}
                        onChange={(e) => setDisposaltype(e.target.value)}
                        placeholder="처분방식"
                        style={{ width: '100%', marginBottom: '10px', height: '30px' }}
                    />
                    {errors.Disposaltype && <div style={{ color: 'red', marginTop: '-10px',marginBottom: '10px' }}>{errors.Disposaltype}</div>}
                    <label>임차여부</label>
                    <input
                        type="text"
                        value={renter}
                        onChange={(e) => setRenter(e.target.value)}
                        placeholder="임차여부"
                        style={{ width: '100%', marginBottom: '10px', height: '30px' }}
                    />
                    <label>지목/면적</label>
                    <div style={{ display: 'flex' }}>
                        <select onChange={(e) => setLandclassification(e.target.value)}
                                style={{ marginRight: '10px', height: '30px', width: '15%' }}>
                                    <option value="">=선택=</option>
                                    {land_classification_array?.map(item => (
                                        <option key={item.idx} value={item.code}>{item.name}</option>
                                    ))}
                        </select>
                        <input
                            type="text"
                            value={ld_area}
                            onChange={(e) => setLdarea(e.target.value)}
                            placeholder="토지면적"
                            style={{ width: '25%', marginBottom: '10px', height: '30px' }}
                        />
                        <input
                            type="text"
                            value={ld_area_memo}
                            onChange={(e) => setLdareamemo(e.target.value)}
                            placeholder="토지면적 메모"
                            style={{ width: '100%', marginLeft: '5px', height: '30px' }}
                        />
                    </div>
                    {errors.ld_area && <div style={{ color: 'red',marginTop: '-10px',marginBottom: '10px' }}>{errors.ld_area}</div>}
                
                    <label>건축물면적</label>
                    <div style={{ display: 'flex' }}>
                        <input
                            type="text"
                            value={build_area}
                            onChange={(e) => setBuildarea(e.target.value)}
                            placeholder="건축물면적"
                            style={{ width: '42%', marginBottom: '10px',  marginRight: '5px',height: '30px' }}
                        />
                        <input
                            type="text"
                            value={build_area_memo}
                            onChange={(e) => setBuildareamemo(e.target.value)}
                            placeholder="건축물면적 메모"
                            style={{ width: '100%', marginBottom: '10px', height: '30px' }}
                        />
                    </div> 
                    {errors.build_area && <div style={{ color: 'red', marginTop: '-10px',marginBottom: '10px' }}>{errors.build_area}</div>}
                    <hr style={{ margin: '15px 0' }} />
                    <label>「국토의 계획 및 이용에 관한 법률」에 따른 지역ㆍ지구등</label>
                    <CKEditor
                        editor={ClassicEditor}
                        data={national_land_planning_use_laws}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            setNationalLandPlanningUseLaws(data);
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
                    <label style={{  marginTop: '15px' }}>다른 법령 등에 따른 지역ㆍ지구등</label>
                    <CKEditor
                        editor={ClassicEditor}
                        data={other_laws}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            setOtherLaws(data);
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
                    <label style={{  marginTop: '15px' }}>「토지이용규제 기본법 시행령」</label>
                    <CKEditor
                        editor={ClassicEditor}
                        data={enforcement_decree}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            setEnforcementdecree(data);
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

                    <hr style={{ margin: '15px 0' }} />
                    <label>부동산종류</label>
                    {/* <input
                        type="text"
                        value={estateType}
                        onChange={(e) => setEstateType(e.target.value)}
                        placeholder="부동산종류"
                        style={{ width: '100%', marginBottom: '20px', height: '30px' }}
                    /> */}
                    <div className="estateTypeContainer">
                        {estateTypes.map((type, index) => (
                            <label key={index} className="estateTypeLabel">
                                <input
                                    type="checkbox"
                                    value={type.code}
                                    checked={selectedEstateType === type.code}
                                    onChange={handleEstateTypeChange}
                                    className="estateTypeCheckbox"
                                />
                               {type.name}
                            </label>
                        ))}
                    </div>
                    {errors.estateType && <div style={{ color: 'red', marginTop: '-20px',marginBottom: '10px' }}>{errors.estateType}</div>}
                </div>

                <hr style={{ margin: '20px 0' }} />

                

                <div style={{ marginBottom: '20px' }}>
                    <label>메모</label> 
                    <label style={{ marginBottom: '10px',marginLeft: '10px', alignItems: 'center', height: '30px', width: '10%' }}>관심목록</label>
                    <select onChange={(e) => categorySelectChange(e.target.value)}
                                style={{ marginBottom: '10px',marginRight: '10px', height: '30px', width: '25%' }}>
                                    <option value="">=선택=</option>
                                    {categories?.map(item => (
                                        <option key={item.idx} value={item.idx}>{item.content}</option>
                                    ))}
                    </select>
                    <UIButton onClick={toggleCategoryModal} >관심목록추가</UIButton>
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

                { isAddrModalOpen ? (<FindAddr show={isAddrModalOpen} onHide={ (e) => toggleAddrModal(e)} onSelect={selectAddress} />) : "" }   
                { isCategoryModalOpen ? ( <Category show={isCategoryModalOpen} onClose={(e) =>toggleCategoryModal(e)}  onSelect={()=>{}} />) : "" }
             

            </form>
        </div>
    );
};

export default OnBidRegst;
