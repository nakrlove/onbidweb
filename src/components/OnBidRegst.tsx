import React, { useState,  useEffect ,useRef} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // useNavigate 훅 임포트
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import './css/OnBidRegst.css'; // CSS 파일 import

import { useCategory } from './provider/CategoryProvider'; // Context 사용
import useFetchData    from './hooks/useFetchData';
import useCustomStateManagement  from './hooks/useCustomStateManagement';
// import SingletonStateManager  from './hooks/SingletonStateManager';

import FindAddr from './modals/FindAddr';
import Category from './modals/Categroy';
import { handlePhoneNumberChange, handleNumberInputChange, handleKeyPress } from './utils/validationUtils';
import { OnbidItem,OnbidDays,OnBidMemo,OnBidCategroy,UseFetchData,States ,Attchfile}  from '../components/model/regst';


import styled from 'styled-components';

import plus from '../assets/plus.png'; // 경로는 파일의 위치에 따라 조정
import plus1 from '../assets/plus-1.png'; // 경로는 파일의 위치에 따라 조정
import minus from '../assets/minus.png'; // 경로는 파일의 위치에 따라 조정
import edit from '../assets/edit.png'; // 경로는 파일의 위치에 따라 조정
import search from '../assets/search.png'; // 경로는 파일의 위치에 따라 조정
import UIButton from './ui/UIButton';
import { initial } from 'lodash';

import { format } from 'date-fns';


const MAX_FILE_SIZE = 100 * 1024 * 1024; // 10MB

interface Code {
    idx: number;
    code: string;
    name: string;
}

const Image = styled.img`
width: 20px;
height: 20px;
`;

interface DataSet
{
    bididx: number,
    addr1: string,
    addr2: string,
    it_type: string,
    ld_area: string,
    ld_area_memo: string,
    ld_area_pyeong: string,
    build_area: string,
    build_area_memo: string,
    build_area_pyeong: string,
    rd_addr: string,
    streeaddr2: string,
    bruptcy_admin_name: string,
    bruptcy_admin_phone: string,
    renter: string,
    estatetype: string,
    disposal_type: string,
    note:string,
    land_classification: string,
    progress_status: string,
    edate: string,
    evalue: string,
    deposit: string,
    onbid_status: string,
    status: string,
    land_classification_name: string,
    national_land_planning_use_laws: string,
    other_laws: string,
    enforcement_decree: string,
    idx: 0,
    debtor: string,
}// 데이터 타입 정의

const initialState: DataSet = 
{
    bididx: 0,
    addr1: "",
    addr2: "",
    it_type: "",
    ld_area: "",
    ld_area_memo: "",
    ld_area_pyeong: "",
    build_area: "",
    build_area_memo: "",
    build_area_pyeong: "",
    rd_addr: "",
    streeaddr2: "",
    bruptcy_admin_name: "홍따",
    bruptcy_admin_phone: "02-3223-2322",
    renter: "",
    estatetype: "",
    disposal_type: "",
    note:"",
    land_classification: "",
    progress_status: "",
    edate: "",
    evalue: "",
    deposit: "",
    onbid_status: "",
    status: "",
    land_classification_name: "",
    national_land_planning_use_laws: "",
    other_laws: "",
    enforcement_decree: "",
    idx: 0,
    debtor: "",
}// 데이터 타입 정의


const bidDate:OnbidDays = { 
    //   edate: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
      edate: ''
    , evalue: 0
    , deposit: 0 
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

interface Category{ idx: number; content: string; user: string; regdate: string }



// const initialSetup = () => {
//     console.log('초기 설정 작업 수행');
//     // 여기에 초기 설정 코드 작성

//     const {  data ,days,setDays, replaceDays, appendDays
//         // , memo ,setMemo,replaceMemo
//          , status
//          , bididx
//          , attchfile
//          , loading
//          , error } = useFetchData<DataSet,OnbidDays,OnBidMemo,OnBidCategroy>();
    
//     console.log(`  JSON result ${JSON.stringify(data)}`)
//     return data
// };



// 반환 타입 정의
interface FetchSelectOptionsResult {
    selectsOptions: Code[];
    land_classification_array: Code[];
    estateTypes: Code[];
    categories: States[];
}

const initfetchSelectOptions = async (action:Boolean): Promise<FetchSelectOptionsResult>  => {

    let selectsOptions:Code[] = [];
    let land_classification_array:Code[] = [];
    let estateTypes:Code[] = [];
    let categories : States[] = []; 
    /* 파일첨부 코드조회 */
    try {
        const response = await axios.post('/api/onbid/file-code');
        selectsOptions = response.data
    } catch (error) {
        console.error('Error fetching select options:', error);
    }

    /* 지목 */
    try {
        const response = await axios.post('/api/onbid/file-code?codes=003');
        // setLandclassificationarray(response.data);
        land_classification_array = response.data;
    } catch (error) {
        console.error('Error fetching select options:', error);
    }

    /* 입찰진행상태 */
    // try {
    //     const response = await axios.post('/api/onbid/file-code?codes=037');
    //     setOnbidStatusArray(response.data);
    // } catch (error) {
    //     console.error('Error fetching select options:', error);
    // }

    /* 부동산종류 */
    try {
        const response = await axios.post('/api/onbid/file-code?codes=044');
        estateTypes = response.data
    } catch (error) {
        console.error('Error fetching select options:', error);
    }


    /* 관심목록 */
    console.log(` action value=${action}`)
    if(action){
        try {
            const response = await axios.post('/api/onbid/categroyList');
            categories = response.data;
        } catch (error) {
            console.error('Error fetching select options:', error);
        }
    }
 
    return {selectsOptions,land_classification_array,estateTypes,categories}    
};


/**
 * Base64 인코딩된 파일을 File 객체로 변환하기
 * @param base64  Base64 인코딩된 파일을 File 객체로 변환하기
 * @param filename 
 * @returns 
 */
const fileFromBase64 = (base64:string, filename: string,filetype: string) => {
    const byteCharacters = atob(base64);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, { type: filetype });
    return new File([blob], filename);

}

const OnBidRegst = () => {
    
    const { categories, setCategories } = useCategory(); //provier 적용

    /* 지목*/
    // const selectRefs = useRef<(HTMLSelectElement)>(null);
    // const [addr1         , setAddr1]         = useState('');
    // const [addr2         , setAddr2]    = useState('');
    // const [rd_addr           , setRdaddr]           = useState('');
    // const [bruptcy_admin_name , setBruptcyAdminName] = useState('');
    // const [bruptcy_admin_phone, setBruptcyAdminPhone]= useState('');
    // const [categories  , setCategories]  = useState<States[]>([])
    
    ///////////////////////////////////////////////////////////
    const [filesOrigin      , setFilesOrigin]      = useState<Attchfile[]>([files]);
    const [additionalFiles  , setAdditionalFiles]  = useState<Attchfile[]>([files]);

    const [state            , setState]            = useState<DataSet>(initialState);
    const [stateOrigin      , setStateOrigin]      = useState<DataSet>(initialState);

    const [memo             , setMemo]             = useState<OnBidMemo[]>([{ idx: 0, memo_contents: '', regdate: '', bididx: 0 }]);
    const [memoOrigin       , setMemoOrigin ]      = useState<OnBidMemo[]>([{ idx: 0, memo_contents: '', regdate: '', bididx: 0 }]);
    
    //입찰일자
    const [bankruptcyAuctionBidDate       , setBankruptcyAuctionBidDate]        = useState<OnbidDays[]>([bidDate]);
    const [bankruptcyAuctionBidDateOrigin , setBankruptcyAuctionBidDateOrigin] = useState<OnbidDays[]>([bidDate]);
   
    // const [connoisseur, setConnoisseur] = useState('');
    const [selectsOptions, setSelectsOptions] = useState<Code[]>([]);

    // const [note          , setNote]           = useState('');
   
    
   
    // const [renter        , setRenter]         = useState('');
    // const [ld_area         , setLdarea]         = useState('');
    // const [ld_area_memo    , setLdareamemo]     = useState(''); //토지면적 메모
    // const [build_area      , setBuildarea]      = useState('');
    // const [build_area_memo , setBuildareamemo]  = useState(''); //건물면적 메모
    const [estateTypes     , setEstateTypes]    = useState<Code[]>([]);
    // const [other_laws      , setOtherLaws]      = useState('');             //다른 법령 등에 따른 지역ㆍ지구등
    // const [enforcement_decree                , setEnforcementdecree] = useState('');  //시행령
    const [national_land_planning_use_laws   , setNationalLandPlanningUseLaws] = useState(''); //「국토의 계획 및 이용에 관한 법률」에 따른 지역ㆍ지구등
    
    
     // 하나의 선택된 부동산 종류를 관리하는 상태 변수
     const [selectedEstateType, setSelectedEstateType] = useState<Code['code']>('');

    // const [disposal_type  , setDisposaltype]   = useState('');
    // const [debtor        , setDebtor]          = useState(''); /* 채무자명 */
    
    const [land_classification, setLandclassification] = useState(''); /* 지목 */
    const [land_classification_array, setLandclassificationarray] = useState<Code[]>([]); /* 지목 */
    // const [progress_status, setProgressstatus] = useState(''); /* 진행상태*/


    const [onbid_status, setOnbidStatus]      = useState(''); /* 지목 */
    const [categorystatus, setCategoryStatus] = useState<number>(); /* 관심종목 */
    //const [category,setCategory] = useState<Category[]>([]); /* 관심목록 */


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
    });
    
    
    const navigate = useNavigate(); // useNavigate 훅 사용

    const [isAddrModalOpen    , setIsAddrModalOpen    ] = useState(false); // 모달 열림 상태
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false); // 모달 열림 상태
    const [dataLoaded, setDataLoaded] = useState(false);
    // const [onbidData , setOnbidData] = useState<OnbidItem>(initialState);
    // const stateManager = SingletonStateManager.getInstance();
    // 상태 업데이트 함수를 싱글톤으로부터 얻음
    // const { updateState, updateSpecificKey }  = stateManager.useCustomStateManagement<OnbidItem>(initialState, setOnbidData);
    // const { state, updateState, updateSpecificKey } = stateManager.useCustomState(initialState);
   

   
   
    // useFetchData 훅 호출하여 데이터 상태 가져오기
    let action: Boolean  = false;
    useEffect(() => {
      
       // setCategories(rcategories); // 상태 업데이트
        if(categories.length === 0) {
            action = true;
        }

        const fetchData = async () => {
        
            const {selectsOptions,land_classification_array,estateTypes,categories}  = await initfetchSelectOptions(action)
                setSelectsOptions(selectsOptions);
                setEstateTypes(estateTypes);
                
                setLandclassificationarray(land_classification_array);
                if(categories.length !== 0 ){
                    setCategories(categories);
                }
               
            };

        fetchData();
    }, []); // 컴포넌트가 처음 렌더링될 때 한 번만 호출



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
                //     console.log(` fiile input 입니다.`)
                setDataLoaded(!dataLoaded);
                //첨부파일
                setAdditionalFiles(attchfile)
                setFilesOrigin(attchfile)
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

        if (!state.addr1) {
            newErrors.addr1 = '주소 입력이 필요합니다.';
            isValid = false;
        }

        if (!state.addr2) {
            newErrors.addr2 = '상세 주소 입력이 필요합니다.';
            isValid = false;
        }

        if (!state.bruptcy_admin_name) {
            newErrors.bruptcy_admin_name = '파산관제인명 입력이 필요합니다.';
            isValid = false;
        }

        if (!state.bruptcy_admin_phone) {
            newErrors.bruptcy_admin_phone = '전화번호 입력이 필요합니다.';
            isValid = false;
        }

        if (additionalFiles.some(fileWrapper => !fileWrapper.file)) {
            newErrors.file = '파일이 필요합니다.';
            isValid = false;
        }

        if (!state.disposal_type) {
            newErrors.disposal_type = '처분방식 입력이 필요합니다.';
            isValid = false;
        }

        if (!state.ld_area) {
            newErrors.ldarea = '토지 입력이 필요합니다.';
            isValid = false;
        }

        if (!state.build_area) {
            newErrors.buildarea = '건축물 입력이 필요합니다.';
            isValid = false;
        }

        if (!state.debtor) {
            newErrors.debtor = '채무자명 입력이 필요합니다.';
            isValid = false;
        }
        
        if (!selectedEstateType) {
            newErrors.estateType = '부동산 종류 선택이 필요합니다.';
            isValid = false;
        }

        bankruptcyAuctionBidDate.forEach((item, index) => {
           
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

    /**
     * 첨부파일이 변경됐는지 체크함
     * 변경된게 없다면 파일첨부하지 않음
     * @returns 
     */
    const isFilsChanged = () => {

        if(additionalFiles.length !== filesOrigin.length){
            return true;
        }

        let isFils:Boolean = false;
        for (const key in additionalFiles) {
            if( additionalFiles[key] !== filesOrigin[key] )
            {
                isFils = true;
            }
        }
        return isFils;
    };

    const isFileChanged = (index:number) => {

        if(index > (filesOrigin.length-1)){
            return true;
        }
        let isFils:Boolean = false;
      
        if( additionalFiles[index] !== filesOrigin[index] )
        {
            isFils = true;
       
        }
        return isFils;
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
      
        if (!validateForm()) {
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
            national_land_planning_use_laws: national_land_planning_use_laws,
            other_laws: state.other_laws                   ,
            enforcement_decree: state.enforcement_decree   ,
            idx: categorystatus                            , //관심종목 
        }
        const formData = new FormData();
        // FormData 생성
        formData.append('onbidDTO', new Blob([JSON.stringify(newData)], { type: "application/json" }));
       
      
        /** 입찰일자 */
        let isCheck = isDataChange(bankruptcyAuctionBidDate,bankruptcyAuctionBidDateOrigin)
        if(isCheck){
            formData.append('onbidDays', new Blob([JSON.stringify(bankruptcyAuctionBidDate)], { type: 'application/json' }));
        }
        // FormData 내용 확인
        formData.forEach((value, key) => {
            // if(value instanceof File){
            //    console.log(`key name[${key}]: ${JSON.stringify(value.name)}`);
            // }else {
               console.log(`key name[${key}]: ${JSON.stringify(value)}`);
            // }
        });

       // let isCheck = isFilsChanged()
       // if(isCheck){
        additionalFiles.forEach((fileWrapper, index) => {
            if (fileWrapper.file) { 
                // == orgin ${filesOrigin[index].filename}:[${filesOrigin[index].file?.size}]
                console.log(`new${fileWrapper.filename}:[${fileWrapper.file.size}]`)
                // if(isFileChanged(index)){
                    formData.append(`additionalFiles`      , fileWrapper.file);
                    formData.append(`additionalFileOptions`, fileWrapper.code);
                // }
            }
        });
        // }

        // 서버에 요청 보내기
        const URL = `${process.env.REACT_APP_API_URL}/api/onbid/onBidRegist`;
        try {

            //FormData일때는 Content-Type을 주지 않아도 된다
            //자동으로 FormData가 Content-Type을 잡아준다
            const response = await axios.post(URL, formData, {
                // headers: {
                //     'Content-Type': 'multipart/form-data',
           
                // },
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
        const newbankruptcyAuctionBidDate = [...bankruptcyAuctionBidDate];
        newbankruptcyAuctionBidDate[index] = {
            ...newbankruptcyAuctionBidDate[index],
            [name]: value,
        };
        setBankruptcyAuctionBidDate(newbankruptcyAuctionBidDate);
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
    ///////////////////// files End///////////////////////////


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

    if (!dataLoaded) {
        return <div>데이터를 불러오는 중입니다...</div>;
    }
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', textAlign: 'left' }}>
            <h2>정보 등록 </h2>
            <form onSubmit={doSubmit}>
               
                <div style={{ display: 'flex', alignItems: 'left', marginBottom: '0px' }}>
                    <label style={{ marginBottom: '10px',marginRight: '1px', height: '30px', width: '10%' }}>진행상태</label>
                    <select onChange={(e) => setOnbidStatus(e.target.value)}
                                style={{ marginBottom: '10px',marginRight: '10px', height: '30px', width: '25%' }}>
                                    <option value="">=선택=</option>
                                    {onbidStatusArray?.map(item => (
                                        <option key={`info-${item.idx}`} value={item.code}>{item.name}</option>
                                    ))}
                    </select>
                

                    <label style={{ marginBottom: '10px',marginLeft: '10px', height: '30px', width: '10%' }}>채무자명</label>
                    <input
                        type="text"
                        value={state.debtor}
                        // onChange={(e) => setDebtor(e.target.value)}
                        onChange={(e) => statusChange("debtor",e.target.value)}
                        placeholder="채무자명"
                        style={{ flex: 1, height: '30px' }}
                    />
                </div>
                {errors.debtor && <div style={{ color: 'red', marginTop: '-20px',marginBottom: '10px' }}>{errors.debtor}</div>}
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
                        <button type="button" className="btn-css register-button" onClick={addBankruptcyAuctionBidDate}> 
                            <Image src={plus1} alt="Add"/>
                        </button>
                    </div>
                    <hr style={{ margin: '4px 0' }} />

                    {bankruptcyAuctionBidDate && bankruptcyAuctionBidDate.map((item, index) => (
                        <div key={`onbid-days-${index}`}>
                           
                            <div style={{ display: 'flex' }}>
                            {item.edate|| ''}
                                <input
                                    type="date"
                                    value={item.edate|| ''}
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
                        // onChange={(e) => handlePhoneNumberChange(e, setBruptcyAdminPhone)}
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
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
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
                                    // onChange={handleAdditionalFileChange(index)}
                                    onChange={(e) =>handleFileChange(index,e)}
                                    
                                    style={{ height: '30px', width: '90%' }}
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
                        data={state.other_laws}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            // setOtherLaws(data);
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

                    <hr style={{ margin: '15px 0' }} />
                    <label>부동산종류</label>

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
                    </div>
                    {errors.estateType && <div style={{ color: 'red', marginTop: '-20px',marginBottom: '10px' }}>{errors.estateType}</div>}
                </div>

                <hr style={{ margin: '20px 0' }} />

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
                        // <CKEditor
                        //     editor={ClassicEditor}
                        //     data={}
                        //     onChange={(event, editor) => {
                        //         const data = editor.getData();


                        //         // const newFiles = memo.map((mdata, idx) => {
                        //         //     if (index === idx) {
                        //         //         return { ...fileWrapper, file: e.target.files ? e.target.files[0] : null };
                        //         //     }
                        //         //     return fileWrapper;
                        //         // });
                        //         // setAdditionalFiles(newFiles);

                        //         // setMemo(prevMemo => (prevMemo ? [...prevMemo,memo_content: data] : [data]));
                        //     }}
                        //     config={{
                        //         toolbar: [
                        //             'undo', 'redo', '|',
                        //             'bold', 'italic', 'underline', 'strikethrough', '|',
                        //             'fontColor', 'fontBackgroundColor', '|',
                        //             'link', '|',
                        //             'numberedList', 'bulletedList', '|',
                        //             'alignment', '|',
                        //             'insertTable', 'blockQuote', 'codeBlock', '|',
                        //             'mediaEmbed', 'imageUpload', 'removeFormat'
                        //         ],
                        //     }}
                        // />)
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
