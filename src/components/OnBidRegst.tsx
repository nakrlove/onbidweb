import React, { useState,  useEffect} from 'react';
import axios from 'axios';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// import { handleSubmit } from './utils/Utils';
// import { useInput } from './hooks/useInput';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 임포트
import { CKEditor } from '@ckeditor/ckeditor5-react';

import { useCategory,useLoading } from './provider/CategoryProvider'; // Context 사용
import useRequestApi from './fetchapi/useFetchApi'; // Import the custom hook
import useFetchData  from './hooks/useFetchData'
import useInitData   from './hooks/useInitData'
import { DataSet,Code, FetchSelectOptionsResult }  from './interface/regst';

import Spinner from './common/Spinner'; // 위에서 만든 Spinner 컴포넌트
import UIButton      from './ui/UIButton';
import UINumberInput from './ui/UINumberInput';
import FindAddr      from './modals/FindAddr';
import Category      from './modals/Categroy';
import { handlePhoneNumberChange, handleNumberInputChange, handleKeyPress } from './utils/validationUtils';
import { OnbidItem,OnbidDays,OnBidMemo,OnBidCategroy,UseFetchData,States ,Attchfile}  from './interface/regst';


import styled from 'styled-components';

import './css/OnBidRegst.css'; // CSS 파일 import
import plus   from '../assets/plus.png'; // 경로는 파일의 위치에 따라 조정
import plus1  from '../assets/plus-1.png'; // 경로는 파일의 위치에 따라 조정
import minus  from '../assets/minus.png'; // 경로는 파일의 위치에 따라 조정
import edit   from '../assets/edit.png'; // 경로는 파일의 위치에 따라 조정
import search from '../assets/search.png'; // 경로는 파일의 위치에 따라 조정


const MAX_FILE_SIZE = 100 * 1024 * 1024; // 10MB


const Image = styled.img`
width: 20px;
height: 20px;
`;

const initialState: DataSet = 
{
    bididx : 0,
    addr1  : "",
    addr2  : "",
    it_type: "",
    ld_area: "",
    ld_area_memo  : "",
    ld_area_pyeong: "",
    build_area    : "",
    build_area_memo  : "",
    build_area_pyeong: "",
    rd_addr   : "",
    streeaddr2: "",
    bruptcy_admin_name: "",
    bruptcy_admin_phone: "",
    renter    : "",
    estatetype: "",
    disposal_type: "",
    note:"",
    land_classification: "",
    progress_status: "",
    edate  : "",
    evalue : "",
    deposit: "",
    onbid_status: "",
    status : "",
    land_classification_name: "",
    national_land_planning_use_laws: "",
    other_laws: "",
    enforcement_decree: "",
    idx: 0,
    debtor: "",
    pnu: ""   ,//필지번호
}// 데이터 타입 정의


const bidDate:OnbidDays = { 
    //   edate: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
      edate: ''
    , evalue: ''
    , deposit: '' 
    , bididx:-1
    , daysidx:-1
    , onbid_status:''
    , name:''
    , bblig:-1
}

const files: Attchfile = { 
    idx: 0,
    bididx: 0,
    code: "",
    file: new File([], ""), // 빈 파일 객체로 초기화
    filename: "",
    filetype: "",
    filesize: 0,
    filepath: ""
};

const OnBidRegst = () => {
    
    const RequestApi = useRequestApi(); // useRequestApi 훅을 호출하여 함수 반환
    const { categories, setCategories } = useCategory(); //provier 적용
    const { isLoading , setIsLoading  } = useLoading(); //provier 적용
    
    ///////////////////////////////////////////////////////////
    const [filesOrigin      , setFilesOrigin]      = useState<Attchfile[]>([files]);
    const [additionalFiles  , setAdditionalFiles]  = useState<Attchfile[]>([files]);

    const [state            , setState]            = useState<DataSet>(initialState);
    const [stateOrigin      , setStateOrigin]      = useState<DataSet>(initialState);

    const [memo             , setMemo]             = useState<OnBidMemo[]>([{ idx: 0, memo_contents: '', regdate: '', bididx: 0 }]);
    const [memoOrigin       , setMemoOrigin ]      = useState<OnBidMemo[]>([{ idx: 0, memo_contents: '', regdate: '', bididx: 0 }]);
    
    //입찰일자
    const [bankruptcyAuctionBidDate       , setBankruptcyAuctionBidDate]       = useState<OnbidDays[]>([bidDate]);
    const [bankruptcyAuctionBidDateOrigin , setBankruptcyAuctionBidDateOrigin] = useState<OnbidDays[]>([bidDate]);
   
    const [selectsOptions  , setSelectsOptions] = useState<Code[]>([]);
    const [estateTypes     , setEstateTypes]    = useState<Code[]>([]);

     // 하나의 선택된 부동산 종류를 관리하는 상태 변수
    const [selectedEstateType, setSelectedEstateType] = useState<Code['code']>('');
    const [land_classification, setLandclassification] = useState(''); /* 지목 */
    const [land_classification_array, setLandclassificationarray] = useState<Code[]>([]); /* 지목 */

    const [onbid_status, setOnbidStatus]      = useState(''); /* 지목 */
    const [categorystatus, setCategoryStatus] = useState<number>(); /* 관심종목 */

    /* 입찰진행상태*/
    const [onbidStatusArray,setOnbidStatusArray] = useState<Code[]>([]); /* 진행상태 */

    // Validation States
    const [errors, setErrors] = useState({
        addr1         : '',
        addr2    : '',
        bruptcy_admin_name : '',
        bruptcy_admin_phone: '',
        disposal_type: '',
        ld_area      : ''    ,
        ld_area_memo  : ''    ,
        build_area   : ''    ,
        build_area_memo   : ''    ,
        estateType  : ''    , /* 부동산종류 */
        code: '',
        file        : '',
        sdate       : '',
        edate       : '',
        evalue      : '',
        deposit     : '',
        // disposal_type: '',
        land_classification: '',
        progress_status:   '',
        onbid_status:      '',
        onbidStatusArray:'',
        debtor      :      '', //채무자명
        national_land_planning_use_laws : '', //「국토의 계획 및 이용에 관한 법률」에 따른 지역ㆍ지구등
        other_laws  :      '',   //다른 법령 등에 따른 지역ㆍ지구등
        enforcement_decree: '', //시행령
        idx: 0 , //관심종목 '0' 전체
        msg: '',
        pnu: '', //필지번호
    });
    
    
    const navigate = useNavigate(); // useNavigate 훅 사용

    const [isAddrModalOpen    , setIsAddrModalOpen    ] = useState(false); // 모달 열림 상태
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false); // 모달 열림 상태
    const [dataLoaded, setDataLoaded] = useState(false);
    // 목록 숨기기/펼치기 상태 관리
    const [isListOpen, setIsListOpen] = useState(false);
   
    // useFetchData 훅 호출하여 데이터 상태 가져오기
    let action: Boolean  = false;
    if(categories.length === 0) {
        action = true;
    }

    const {rselectsOptions,rland_classification_array,restateTypes}  =  useInitData(action)
    
    // const data  =  useInitData(action)
    // 데이터를 한 번만 상태에 설정
    useEffect(() => {
        // 비동기 함수를 정의하여 상태를 업데이트
        const updateData = async () => {
           
            if (rselectsOptions ) {
                // 상태 업데이트
                setSelectsOptions(rselectsOptions);
            }

            if (rland_classification_array ) {
                setLandclassificationarray(rland_classification_array);
            }

            if (restateTypes ) {
                setEstateTypes(restateTypes);
                setIsListOpen(true);
            }
          
        };

        updateData();
    }, [rselectsOptions, rland_classification_array, restateTypes]);

    const { data
          , days
          , memos
          , setDays
          , replaceDays
          , appendDays
          , setMemos
          , status
          , bididx
          , attchfile
          , loading
          , error } = useFetchData<DataSet, OnbidDays, OnBidMemo,Attchfile, OnBidCategroy>();
    
    useEffect(() => {
       
         const initializeData = async () => {

            setDataLoaded(false);
            if(data) {
                console.log(`  data ${JSON.stringify(data)}`)

                //상세기본정보
                setState(data); // useFetchData에서 가져온 데이터를 state에 설정
                setStateOrigin(data);

                //입찰일자
                setBankruptcyAuctionBidDate(days)
                setBankruptcyAuctionBidDateOrigin(days)
                // console.log(`attchfile ${JSON.stringify(attchfile)}`)
                /*
                //강제 event호출
                const fakeEvent = {
                    target: {
                        value: data.estatetype, // 원하는 값으로 대체
                    },
                } as React.ChangeEvent<HTMLInputElement>;
                handleEstateTypeChange(fakeEvent);
                */
                setSelectedEstateType(data.estatetype); // 선택된 객체로 상태 업데이트
                setLandclassification(data.land_classification)
                setCategoryStatus(data.idx)

                console.log(` memo ${JSON.stringify(memos)}`)
                //메모
                setMemo(memos)
                setMemoOrigin(memos)

                setDataLoaded(!dataLoaded);
            }
            if(attchfile){
                
                 setDataLoaded(!dataLoaded);
                 if(Array.isArray(attchfile) && attchfile.length === 0){
                    setAdditionalFiles([files])
                    setFilesOrigin([files])
                 }else {
                    
                    //첨부파일
                    setAdditionalFiles(attchfile)
                    setFilesOrigin(attchfile)
                 }
            } 
            console.log(`  state ${JSON.stringify(state)}`)
         };
       
         initializeData();
    }, [ data,attchfile]);
    
    const statusChange = (key:string , value: any) => {
        setState({
            ...state,
            [key]: value, // 변경하고자 하는 속성만 수정
        });
    }; 
    
    const isPopup = !!window.opener;

    /* 주소검색 요청 팝업 */
    const toggleAddrModal = (e: React.MouseEvent<HTMLElement,MouseEvent>) => {
        e.preventDefault(); // 기본 폼 제출 방지
        e.stopPropagation();
        setIsAddrModalOpen(prev => !prev);
    };
   
    // 목록 펼치기/숨기기 토글 함수
    const toggleList = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault(); // 기본 폼 제출 방지
        setIsListOpen(!isListOpen);
    };

    const toggleCategoryModal = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault(); // 기본 폼 제출 방지
        e.stopPropagation();
        setIsCategoryModalOpen(prev => !prev);
    };

    const validateForm = () => {

        const newErrors: any = {};
        let isValid = true;
        let msg:string = ''; 
        if (!state.addr1) {
            newErrors.addr1 = '주소 입력이 필요합니다.';
            msg =   newErrors.addr1 ;
            isValid = false;
        }

        if (!state.addr2) {
            newErrors.addr2 = '상세 주소 입력이 필요합니다.';
            msg =   newErrors.addr2 ;
            isValid = false;
        }

        if (!state.bruptcy_admin_name) {
            newErrors.bruptcy_admin_name = '파산관제인명 입력이 필요합니다.';
            msg =   newErrors.bruptcy_admin_name ;
            isValid = false;
        }

        if (!state.bruptcy_admin_phone) {
            newErrors.bruptcy_admin_phone = '전화번호 입력이 필요합니다.';
            msg =   newErrors.bruptcy_admin_phone ;
            isValid = false;
        }

        if (additionalFiles.some(fileWrapper => !fileWrapper.file)) {
            newErrors.file = '파일이 필요합니다.';
            msg =   newErrors.file ;
            isValid = false;
        }

        if (!state.disposal_type) {
            newErrors.disposal_type = '처분방식 입력이 필요합니다.';
            msg =   newErrors.disposal_type ;
            isValid = false;
        }

        if (!state.ld_area) {
            newErrors.ldarea = '토지 입력이 필요합니다.';
            msg =   newErrors.ldarea ;
            isValid = false;
        }

        // if (!state.build_area) {
        //     newErrors.buildarea = '건축물 입력이 필요합니다.';
        //     msg =   newErrors.buildarea ;
        //     isValid = false;
        // }

        if (!state.debtor) {
            newErrors.debtor = '채무자명 입력이 필요합니다.';
            msg =   newErrors.debtor ;
            isValid = false;
        }
        
        // if (!selectedEstateType) {
        //     newErrors.estateType = '부동산 종류 선택이 필요합니다.';
        //     msg =   newErrors.estateType ;
        //     isValid = false;
        // }

        bankruptcyAuctionBidDate.forEach((item, index) => {
            
            if (!item.edate) {
                newErrors.edate = '입찰일자 입력이 필요합니다.';
                msg =   newErrors.edate ;
                isValid = false;
            }

            // if (!item.evalue && item.evalue === 0) {
            if (!item.evalue) {
                // newErrors[`evalue`] = '감정가 입력이 필요합니다.';
                newErrors[`deposit`] = '감정가 입력이 필요합니다.';
                msg =   newErrors.deposit ;
                isValid = false;
            }

            if (!item.deposit) {
                newErrors.deposit = '보증금 입력이 필요합니다.';
                msg =   newErrors.deposit ;
                isValid = false;
            }
        });


        additionalFiles.forEach((item,index) => {
            //selectsOptions.filter(data => data.code item.code)
            if(!item.code || !item.file){
                newErrors.msg = '첨부파일종류 및 파일을 선택 하세요!';
                msg = newErrors.msg
                isValid = false;
            }
        });
        
        setErrors(newErrors);
        return {isValid,msg};
    };

  
    /**
     * 데이터값 변경여부 체크함
     * 변경되지 않았을경우 수정요청시 데이터를 던지지 않음
     * :입찰일자, 메모 
     * @param newData 
     * @param orginData 
     * @returns 
     */
    const isDataChange =<T,> (newData:T[]  , orginData:T[]):boolean =>{
        if(!Array.isArray(newData) || !Array.isArray(orginData)){
            throw new Error("Invalid input: Both parameters must be arrays");
        }
        if(newData.length !== orginData.length){
            return true;
        }
        let isCheck:boolean = false;
        for (let i = 0 ; i< newData.length; i++){
            if(JSON.stringify(newData[i]) !== JSON.stringify(orginData)){
                isCheck = true;
            }
        } 

        return isCheck;
  
    }
    const doSubmit = async (e: React.FormEvent) => {
      
        e.preventDefault();
        /** 값 validate */
        let {isValid,msg} = validateForm();
        if (!isValid) {
            alert(msg);
            return;
        }
      
        // 파일 크기 확인
        for (const fileWrapper of additionalFiles) {
            if (fileWrapper.file && fileWrapper.filesize > MAX_FILE_SIZE) {
                alert(`File ${fileWrapper.filename} exceeds 10MB limit`);
                return;
            }
        }

        const newData = {
            bididx:  state.bididx                          ,
            addr1:   state.addr1                           ,
            addr2:   state.addr2                           ,
            rd_addr: state.rd_addr                         ,
            bruptcy_admin_name : state.bruptcy_admin_name  ,
            bruptcy_admin_phone: state.bruptcy_admin_phone ,
            note: state.note                               ,
            memo: memo                                     ,
            renter : state.renter                          ,
            ld_area: state.ld_area                         ,
            ld_area_memo: state.ld_area_memo               ,
            build_area  : state.build_area                 ,
            build_area_memo: state.build_area_memo         ,
            estateType: selectedEstateType                 ,
            disposal_type: state.disposal_type             ,
            land_classification: land_classification  ,
            progress_status: state.progress_status         ,
            onbid_status: onbid_status                     ,
            debtor: state.debtor                           ,
            national_land_planning_use_laws: state.national_land_planning_use_laws,
            other_laws: state.other_laws                   ,
            enforcement_decree: state.enforcement_decree   ,
            idx: categorystatus                            , //관심종목 
            pnu: state.pnu                                 , //필지정보
        }
        const formData = new FormData();
        // FormData 생성
        formData.append('onbidDTO', new Blob([JSON.stringify(newData)], { type: "application/json" }));
       
      
        /** 입찰일자 */
        let isCheck = isDataChange(bankruptcyAuctionBidDate,bankruptcyAuctionBidDateOrigin)
        if(isCheck){

          formData.append('onbidDays', new Blob([JSON.stringify(bankruptcyAuctionBidDate)], { type: 'application/json' }));
        // formData.append('onbidDays', new Blob([JSON.stringify(bidData)], { type: 'application/json' }));
          
        }
        
        // FormData 내용 확인
        formData.forEach((value, key) => {
            // if(value instanceof File){
            //    console.log(`key name[${key}]: ${JSON.stringify(value.name)}`);
            // }else {
               let val = JSON.stringify(value);
               console.log(`key name[${key}]: ${val}`);
            // }
        });
       
        
        additionalFiles.forEach((fileWrapper, index) => {
            if (fileWrapper.file) { 
                formData.append(`additionalFiles`      , fileWrapper.file);
                formData.append(`additionalFileOptions`, fileWrapper.code);
            }
        });
        // }

        // 서버에 요청 보내기
        const URL = `${process.env.REACT_APP_API_URL}/api/onbid/onBidRegist`;
        try {

            //FormData일때는 Content-Type을 주지 않아도 된다
            //자동으로 FormData가 Content-Type을 잡아준다
            const response = await axios.post(URL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
           
                },
            });
            console.log('Form submitted successfully:', response.data);
        
            if(isPopup){
                window.alert('작업을 완료되었습니다.');
                window.close(); // 팝업 창을 닫습니다
                return;
            }
            
            navigate('/onbid-list', { replace: true }); // 목록화면으로 이동 
        } catch (error) {
            console.error('Error submitting the form:', error);
        }
    };

  
    // 입력값 변경 핸들러
    const handleInputChange = (index: number, event: React.ChangeEvent<HTMLInputElement>,removeCommasData:string|null) => {
        const { name, value } = event.target;
        let inputData = removeCommasData !== null ? removeCommasData : value;
        
        setBankruptcyAuctionBidDate(prevState => {
            const newbankruptcyAuctionBidDate = [...prevState];
            newbankruptcyAuctionBidDate[index] = {
                ...newbankruptcyAuctionBidDate[index],
                [name]: inputData,
            };
            console.log(`Updated bankruptcyAuctionBidDate at index ${index}: ${JSON.stringify(newbankruptcyAuctionBidDate[index])}`);
            return newbankruptcyAuctionBidDate;
        });
    };

  
    /* 파일첨부 종류선택 */
    const handleSelectChange = (index: number) => (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newFiles = additionalFiles.map((fileWrapper, idx) => {
            if (index === idx) {
                return { ...fileWrapper, code: event.target.value };
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
        setCategoryStatus(parseInt(value))
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
   
    };

    const addAdditionalFileInput = () => {
        setAdditionalFiles([...additionalFiles, files]);
    };

    ///////////////////// files Start///////////////////////////
    // 신규 파일을 추가할 때 호출
    const addAdditionalFile = (newFile: File, code: string) => {
        setAdditionalFiles(prevFiles => [
            ...prevFiles,
            { 
                idx: 0, // 신규 파일이므로 기본 값 설정
                bididx: 0, // 필요한 경우 적절한 값으로 설정
                code: code, // code 값을 추가합니다.
                file: newFile,
                filename: newFile.name,
                filetype: newFile.type,
                filesize: newFile.size,
                filepath: ""
            }
        ]);
    };

    // 기존 파일을 수정할 때 호출
    const handleUpdateFile = (index: number, newFile: File, code: string) => {
        setAdditionalFiles(prevFiles => {
            const updatedFiles = [...prevFiles];
            const fileToUpdate = updatedFiles[index];
            
            if (fileToUpdate) {
                updatedFiles[index] = {
                    ...fileToUpdate,
                    file: newFile,
                    filename: newFile.name,
                    filesize: newFile.size,
                    filetype: newFile.type,
                    code: code // 수정 시에도 code 값을 추가합니다.
                };
            }
            return updatedFiles;
        });
    };
    
   
    // 파일 변경 핸들러
    const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;

        if (files && files.length > 0) {
            const newFile = files[0];
            const fileWrapper = additionalFiles[index];
            
            if (fileWrapper) {
                // 기존 파일을 수정
                handleUpdateFile(index, newFile, fileWrapper.code); // 기존의 code 값을 유지합니다.
            } else {
                // 신규 파일을 추가
                const selectedOption = selectsOptions.find(option => option.code === e.target.value); // 현재 선택된 code를 가져옵니다
                const selectedCode = selectedOption?.code || ""; 
                handleAddNewFile(newFile, selectedCode); // 신규 파일 추가 시 code 값을 설정합니다.
            }
        }
    };

    // 파일을 신규 추가할 때 호출
    const handleAddNewFile = (newFile: File, code: string) => {
        addAdditionalFile(newFile, code); // code 값을 추가합니다.
    };


    /* 첨부파일삭제 */
    const handleFileDelete = (attchfile:Attchfile) => {
    
        if(!window.confirm('삭제하시겠습니까?')){
            return;
        }

       // 특정 객체를 제외한 새로운 배열을 생성
        setAdditionalFiles(prevFiles => 
            prevFiles.filter(file => file !== attchfile)
        );
    };
    
    ///////////////////// files End///////////////////////////

    // const {
    //     value            : eValue,
    //     removeValue           : mvalue,
    //     handleInputChange: handleEvalueChange,
    //     hasError: emailHasError,
    //   } = useInput("", ()=>true);
    
    /** 입찰일자/감정가/보증금 추가 */
    const addBankruptcyAuctionBidDate = () => {
        setBankruptcyAuctionBidDate([...bankruptcyAuctionBidDate,bidDate]);
    };

    /** 입찰일자/감정가/보증금 삭제 */
    const delBankruptcyAuctionBidDate = (idx: number) => {
        const updatedbankruptcyAuctionBidDate = bankruptcyAuctionBidDate.filter((_, i) => i !== idx);
        setBankruptcyAuctionBidDate(updatedbankruptcyAuctionBidDate);
    };

    const selectAddress = (addr1: string | null | undefined, addr2: string) => {
        if (typeof addr1 === 'string' && addr1.trim() !== '') {

            setState({
                ...state,
                addr1: addr1, // 변경하고자 하는 속성만 수정
                rd_addr:addr2
            });
            // ChangeEventStatus("addr1",addr1)
        }
    }

    if (isLoading) {
        return <Spinner /> ;
    }
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', textAlign: 'left' }}>
            <h2>정보 등록 </h2>
            <form onSubmit={doSubmit}>
            
                <div style={{ display: 'flex', alignItems: 'left', marginBottom: '0px' }}>
                    <label style={{ marginBottom: '10px',marginRight: '1px', height: '30px', width: '10%' }}>필지번호</label>
                    {/* <select onChange={(e) => setOnbidStatus(e.target.value)}
                            style={{ marginBottom: '10px',marginRight: '10px', height: '30px', width: '25%' }}>
                                    <option value="">=선택=</option>
                                    {onbidStatusArray?.map(item => (
                                        <option key={`info-${item.idx}`} value={item.code}>{item.name}</option>
                                    ))}
                    </select> */}
                    <input
                        type="text"
                        value={state.pnu}
                        onChange={(e) => statusChange("pnu",e.target.value)}
                        placeholder="필지번호"
                        style={{ flex: 1, height: '30px' }}
                    />

                    <label style={{ marginBottom: '10px',marginLeft: '10px', height: '30px', width: '10%' }}>채무자명</label>
                    <input
                        type="text"
                        value={state.debtor}
                        onChange={(e) => statusChange("debtor",e.target.value)}
                        placeholder="채무자명"
                        style={{ flex: 1, height: '30px' }}
                    />
                </div>
                {errors.debtor && <div style={{ color: 'red', marginTop: '-15px',marginBottom: '10px' }}>{errors.debtor}</div>}
                <hr style={{ margin: '2px 0' }} />
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                    <input
                        type="text"
                        value={state.addr1}
                        // onChange={(e) => setAddr1(e.target.value)}
                        onChange={(e) => statusChange("addr1",e.target.value)}
                        placeholder="주소 입력"
                        style={{ flex: 1, marginRight: '10px', height: '30px' }}
                    />
                    <button type="button" onClick={toggleAddrModal} style={{ width: '22%', textAlign: 'center',border: '1px solid #ddd' }}>
                        <Image src={search} alt="search"/> 주소 검색
                    </button>
                    
                </div>
                {errors.addr1 && <div style={{ color: 'red', marginTop: '-20px',marginBottom: '10px' }}>{errors.addr1}</div>}
                <div style={{ marginBottom: '20px' }}>
                    <input
                        type="text"
                        value={state.addr2}
                        // onChange={(e) => setAddr2(e.target.value)}
                        onChange={(e) => statusChange('addr2',e.target.value)}
                        placeholder="상세 주소 입력"
                        style={{ width: '100%', marginBottom: '10px', height: '30px' }}
                    />
                    {errors.addr2 && <div style={{ color: 'red', marginTop: '-10px',marginBottom: '10px' }}>{errors.addr2}</div>}
                    <input
                        type="text"
                        value={state.rd_addr}
                        // readOnly={false}
                        placeholder="도로명 주소"
                        onChange={(e) => statusChange('rd_addr',e.target.value)}
                        style={{ width: '100%', marginBottom: '10px', height: '30px' }}
                    />
                    <hr style={{ margin: '20px 0' }} />
                </div>


                <div style={{ marginBottom: '3px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '-4px' }}>
                        <span style={{ width: '35%',marginRight: '5%'}}>입찰일자</span>
                        <span >감정가/보증금</span>
                        <button type="button" className="btn-css register-button" onClick={addBankruptcyAuctionBidDate}> 
                            <Image src={plus1} alt="Add"/>
                        </button>
                    </div>
                    <hr style={{ margin: '4px 0' }} />

                    {bankruptcyAuctionBidDate && bankruptcyAuctionBidDate.map((item, index) => (
                        <div key={`onbid-days-${index}`}>
                        
                            <div style={{ display: 'flex' }}>
                                <input
                                    type="date"
                                    value={item.edate|| ''}
                                    name={`edate`}
                                    placeholder="입찰 종료일"
                                    onChange={(e) => handleInputChange(index, e,null)}
                                    onKeyDown={(e) => e.preventDefault()} // Prevent direct typing
                                    style={{ width: '35%',marginRight: '5%', height: '30px' }}
                                />
                                <UINumberInput
                                    initialValue={item.evalue}
                                    name={`evalue`}
                                    onChange={(e,removeCommasData) =>handleInputChange(index, e,removeCommasData)}
                                    placeholder="감정가"/>
                                {/* <input
                                    type="text"
                                    value={value = item.evalue}
                                    name={`evalue`}
                                    placeholder="감정가"
                                    onChange={handleEvalueChange}
                                    style={{ width: '30%', textAlign: 'right',marginRight: '0.5%', height: '30px' }}
                                /> */}
                                <UINumberInput
                                    name={`deposit`}
                                    initialValue={item.deposit}
                                    onChange={(e,removeCommasData,) =>handleInputChange(index, e,removeCommasData)}
                                    placeholder="보증금"/>
                                {/* <input
                                    type="text"
                                    value={item.deposit || ''}
                                    name={`deposit`}
                                    placeholder="보증금"
                                    onChange={(e) => handleInputChange(index, e)}
                                    style={{ width: '30%', textAlign: 'right', marginRight: '1%',height: '30px' }}
                                /> */}
                                <button type="button" className="btn-css register-button" onClick={() => delBankruptcyAuctionBidDate(index)}>
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
                        value={state.bruptcy_admin_name}
                        // onChange={(e) => setBruptcyAdminName(e.target.value)}
                        onChange={(e) => statusChange('bruptcy_admin_name',e.target.value)}
                        placeholder="파산관제인명"
                        style={{ width: '100%', marginBottom: '10px', height: '30px' }}
                    />
                    {errors.bruptcy_admin_name && <div style={{ color: 'red', marginTop: '-10px',marginBottom: '10px' }}>{errors.bruptcy_admin_name}</div>}

                    <label>전화번호</label>
                    <input
                        type="text"
                        value={state.bruptcy_admin_phone}
                        onChange={(e) => statusChange('bruptcy_admin_phone',e.target.value)}
                        placeholder="전화번호"
                        style={{ width: '100%', marginBottom: '20px', height: '30px' }}
                    />
                    {errors.bruptcy_admin_phone && <div style={{ color: 'red', marginTop: '-20px',marginBottom: '10px' }}>{errors.bruptcy_admin_phone}</div>}
                </div>
                <hr style={{ margin: '10px 0' }} />
                <div style={{ marginBottom: '20px' }}>
                    <label>유의사항</label>
                    <CKEditor
                        editor={ClassicEditor}
                        data={state.note}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            // setNote(data);
                            statusChange('note',data)
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
                        <div key={`file-info-${index}`} style={{ marginBottom: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
                                <select
                                    value={fileWrapper.code}
                                    onChange={handleSelectChange(index)}
                                    style={{ marginRight: '10px', height: '30px', width: '25%' }}>
                                    <option value="">=선택=</option>
                                    {selectsOptions?.map(item => (
                                        <option key={`file-attach-${item.idx}`} value={item.code}>{item.name}</option>
                                    ))}
                                </select>
                            
                                <input
                                    type="file"
                                    onChange={(e) =>handleFileChange(index,e)}
                                    style={{ height: '30px', width: '90%' }}
                                />
                                {/* 첨부파일 삭제버튼 */}
                                <button type="button" onClick={()=>handleFileDelete(fileWrapper)} className="btn-css register-button">
                                        <Image  src={minus} alt="Minus" />
                                </button>
                                                                
                            </div>
                            <label>{fileWrapper.filename}</label>
                        </div>
                    ))}
                    {/* {errors.file && <div style={{ color: 'red', marginBottom: '10px' }}>{errors.file}</div>} */}
                </div>
                <hr style={{ margin: '20px 0' }} />
                <div style={{ marginBottom: '20px' }}>
                    <input
                        type="text"
                        value={state.disposal_type}
                        // onChange={(e) => setDisposaltype(e.target.value)}
                        onChange={(e) => statusChange('disposal_type',e.target.value)}
                        placeholder="처분방식"
                        style={{ width: '100%', marginBottom: '10px', height: '30px' }}
                    />
                    {errors.disposal_type && <div style={{ color: 'red', marginTop: '-10px',marginBottom: '10px' }}>{errors.disposal_type}</div>}
                    <label>임차여부</label>
                    <input
                        type="text"
                        value={state.renter}
                        // onChange={(e) => setRenter(e.target.value)}
                        onChange={(e) => statusChange('renter',e.target.value)}
                        placeholder="임차여부"
                        style={{ width: '100%', marginBottom: '10px', height: '30px' }}
                    />
                    <label>지목/면적</label>
                    <div style={{ display: 'flex' }}>
                        <select onChange={(e) => setLandclassification(e.target.value) }
                                // ref={selectRefs}
                                value={land_classification}
                                style={{ marginRight: '10px', height: '30px', width: '15%' }}>
                                    <option value="">=선택=</option>
                                    {land_classification_array?.map(item => (
                                        <option key={`land-${item.idx}`} value={item.code}>{item.name}</option>
                                    ))}
                        </select>
                        <input
                            type="text"
                            value={state.ld_area}
                            // onChange={(e) => setLdarea(e.target.value)}
                            onChange={(e) => statusChange('ld_area',e.target.value)}
                            placeholder="토지면적"
                            style={{ width: '25%', marginBottom: '10px', height: '30px' }}
                        />
                        <input
                            type="text"
                            value={state.ld_area_memo}
                            // onChange={(e) => setLdareamemo(e.target.value)}
                            onChange={(e) => statusChange('ld_area_memo',e.target.value)}
                            placeholder="토지면적 메모"
                            style={{ width: '100%', marginLeft: '5px', height: '30px' }}
                        />
                    </div>
                    {errors.ld_area && <div style={{ color: 'red',marginTop: '-10px',marginBottom: '10px' }}>{errors.ld_area}</div>}
                
                    <label>건축물면적</label>
                    <div style={{ display: 'flex' }}>
                        <input
                            type="text"
                            value={state.build_area}
                            // onChange={(e) => setBuildarea(e.target.value)}
                            onChange={(e) => statusChange('build_area',e.target.value)}
                            placeholder="건축물면적"
                            style={{ width: '42%', marginBottom: '10px',  marginRight: '5px',height: '30px' }}
                        />
                        <input
                            type="text"
                            value={state.build_area_memo}
                            // onChange={(e) => setBuildareamemo(e.target.value)}
                            onChange={(e) => statusChange('build_area_memo',e.target.value)}
                            placeholder="건축물면적 메모"
                            style={{ width: '100%', marginBottom: '10px', height: '30px' }}
                        />
                    </div> 
                    {errors.build_area && <div style={{ color: 'red', marginTop: '-10px',marginBottom: '10px' }}>{errors.build_area}</div>}
                    <hr style={{ margin: '15px 0' }} />
                    <label>「국토의 계획 및 이용에 관한 법률」에 따른 지역ㆍ지구등</label>
                    <CKEditor
                        editor={ClassicEditor}
                        data={state.national_land_planning_use_laws}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            statusChange('national_land_planning_use_laws',data)
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
                        data={state.other_laws}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            statusChange('other_laws',data)
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
                        data={state.enforcement_decree}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            // setEnforcementdecree(data);
                            statusChange('enforcement_decree',data)
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

                    <hr style={{ margin: '10px 0' }} />
                    <button onClick={(e) => toggleList(e)}><label>부동산종류</label></button>
                    {isListOpen && (
                    <div className="estateTypeContainer">
                        {estateTypes.map((type, index) => (
                            <label key={`estate-type-${index}`} className="estateTypeLabel">
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
                    </div>)}

                    {errors.estateType && <div style={{ color: 'red', marginTop: '-20px',marginBottom: '10px' }}>{errors.estateType}</div>}
                </div>

                <hr style={{ margin: '10px 0' }} />

                <div style={{ marginBottom: '20px' }}>
                    <label>메모</label> 
                    <label style={{ marginBottom: '10px',marginLeft: '10px', alignItems: 'center', height: '30px', width: '10%' }}>관심목록</label>
                    <select onChange={(e) => categorySelectChange(e.target.value)}
                            value={categorystatus}
                            style={{ marginBottom: '10px',marginRight: '10px', height: '30px', width: '25%' }}>
                                    <option value="">=선택=</option>
                                    {categories?.map(item => (
                                        <option key={`memo-${item.idx}`} value={item.idx}>{item.content}</option>
                                    ))}
                    </select>
                    <UIButton onClick={toggleCategoryModal} >관심목록추가</UIButton>
                    {memo && memo.length > 0 ? memo.map((mdata,index) => (
                    
                        <CKEditor
                            editor={ClassicEditor}
                            key={mdata.idx}  // 고유한 키 부여
                            data={mdata.memo_contents}
                            onChange={(_, editor) => {
                                const data = editor.getData();
                                setMemo((prevMemo) => {
                                    const updatedMemo = [...prevMemo];
                                    updatedMemo[index] = {
                                        ...updatedMemo[index],
                                        memo_contents: data,
                                    };
                                    return updatedMemo;
                                });
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
                    )) : (

                        <p>No memos available</p>
                
                    )
                }
                    
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
