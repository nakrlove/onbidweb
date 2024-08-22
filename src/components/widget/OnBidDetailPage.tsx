import React, { useState, useEffect,useCallback,useRef ,useMemo} from 'react';
import '../css/OnBidDetailPage.css'; // 스타일을 위한 CSS 파일
import axios from 'axios';
import { RequestApi } from '../fetchapi/FetchApi';
import { useLocation } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import styled from 'styled-components';
import plus from '../../assets/plus.png'; // 추가
import minus from '../../assets/minus.png'; // 삭제
import modify from '../../assets/modify.png'; //메모수정
import edit from '../../assets/edit.png'; // 수정
import check from '../../assets/check.png'; // 저장
import newfile from '../../assets/new-file.png'; // 추가
import save from '../../assets/save.png'; // 저장
import deletebtn from '../../assets/delete-minus.png'; // 저장

const Image = styled.img`
  width: 20px;
  height: 20px;
`;
// 데이터 타입 정의
interface OnbidItem {
    idx: number;
    addr1: string;
    addr2: string;
    regdate: string;
    items: string;
    ld_area: string;
    ld_area_pyeong: number;
    build_area: string;
    build_area_pyeong: number;
    rd_addr: string;
    streeaddr2: string;
    bruptcy_admin_name: string;
    bruptcy_admin_phone: string;
    renter: string;
    estateType: string;
    disposal_type: string;
    note: string;
    land_classification: string;
    progress_status: string;
    // memo: string;
    land_classification_name: string;
    name: string;
}

// 데이터 타입 정의
interface OnbidDays {
    sdate: string;
    edate: string;
    deposit: string;
    evalue: string;
    bididx: number;
    daysidx: number;
    onbid_status: string;
    name: string;
    bblig: number;
}

interface OnBidCategroy {
    idx     : number;
    bididx  : number;
    code    : string,
    filename: string,
    filetype: string,    
    filesize: number,
    filepath: string,
    file    : any,
    codename: string,
}
interface OnBidMemo{
    idx    : number,
    memo_contents: string,
    regdate: string,
    bididx : number,
}

const OnBidDetailPage = () => {
    const [data, setData] = useState<OnbidItem>(); // 초기 데이터는 빈 배열
    const [days, setDays] = useState<OnbidDays[]>([]); // 초기 데이터는 빈 배열
    const [category, setCategory] = useState<OnBidCategroy[]>([]); //등록된카테고리목록
    const [memo, setMemo] = useState<OnBidMemo[]>([]); //메모
     /* 입찰진행상태*/
    const [onBidStatusArray,setOnbidstatusarray] = useState<{ idx: number, code: string, name: string }[]>([]); /* 진행상태 */

    const [memoDumy, setMemoDumy] = useState<OnBidMemo|null>(); //메모
    const [showEditor, setShowEditor] = useState<boolean>(false); // CKEditor 표시 상태
    const [editorData, setEditorData] = useState<string>(''); // CKEditor 데이터
    const [error,setError]  = useState<string>('');

    const [mbididx, setMbididx] = useState<number>();
    const [onbid, setOnbid] = useState<boolean>();
    const [salenotice,setSalenotice] = useState<OnBidCategroy>();

    /* 입찰상태값 참조 */
    const selectRefs = useRef<(HTMLSelectElement | null)[]>([]);
    /** 메모수정 index 선택상태 */
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    // 파라메터 넘겨받기 시작
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const paramData = queryParams.get('data');
    const abortControllerRef = useRef<AbortController | null>(null);

    // onbidarray: 체크할 상태 코드를 배열로 정의합니다.
    const onbidarray = ['039', '040', '041'];



    const expensiveValue = useMemo(() => {
      // 가상의 복잡한 계산
      return mbididx;
    }, [mbididx]);


    
    useEffect(() => {
        const fetchData = async () => {
            if (paramData) {
                try {
                    const parsedData = JSON.parse(paramData);
                    console.log(parsedData)
                    if (parsedData) {

                        /* 상세정보 조회 */
                        const abortController = new AbortController();
                        const signal = abortController.signal;
                        const data = await RequestApi("/api/onbid/onBidDetil", "POST", parsedData, signal);
                        console.log(JSON.stringify(data))
                        if (data) {
                            setData(data?.bidMap);
                            setDays(data?.bidDay);
                            setMemo(data?.memos)
                            setMbididx(parsedData.bididx)
                        }

                        /* 파일첨부용도 카테고리조회 */
                        const Icategory = await RequestApi("/api/onbid/category", "POST", parsedData, signal);
                        if(Icategory){
                            setCategory(Icategory)
                            // console.log(JSON.stringify(Icategory))
                          
                        }
                        return () => abortController.abort(); // Cleanup function to abort the request
                    }

                } catch (error) {
                    console.error('Failed to parse JSON data from query string:', error);
                }
            }
        };
        fetchData();
        fetchSelectOptions();
    }, [paramData]);

    useEffect(() => {

        if(days){
        //    // days.some(): days 배열에 있는 각 item의 onbid_status가 onbidarray 포함되어 있는지 확인합니다. 하나라도 포함되어 있으면 true를 반환합니다.
           const hasOnBidStatus = days.some(item => onbidarray.includes(item.onbid_status))
           if(hasOnBidStatus){
            setOnbid(true);
           }
        }

        if(category) { /* 매각공고 */
            let sale = category.find((item) =>  item.code === '041' )
            setSalenotice(sale)
        }
     
    },[days,category]);



    const fetchSelectOptions = useCallback(async () => {

        /* 입찰진행상태 */
        try {
            const response = await axios.post('/api/onbid/file-code?codes=037');
            setOnbidstatusarray(response.data);
        } catch (error) {
            console.error('Error fetching select options:', error);
        }
    }, []);


    const handleAddMemo = () => {
        setShowEditor(true);
    };

    const handleEditorChange = (event: any, editor: any) => {
        const data = editor.getData();
        setEditorData(data);
    };

    /* 메모추가 */
    const handleSaveMemo = () => {
        const fetchData = async () => {
            const abortController = new AbortController();
            const signal = abortController.signal;
            const mData = {'bididx':mbididx,'memo_contents':editorData}
            const memoData = await RequestApi("/api/onbid/momeSave", "POST", (mData), signal);
            if (memoData) {
                setMemo(prevMemo => [...prevMemo,memoData]);
                setEditorData("")
            }
        }
        fetchData();
        setShowEditor(false);
    };

    /* 메모수정 */
    const handleUpdateMemo = (item:OnBidMemo) => {
        const fetchData = async () => {
            const abortController = new AbortController();
            const signal = abortController.signal;
            const mData = {'idx':item.idx,'memo_contents':item.memo_contents}
            const memoData = await RequestApi("/api/onbid/memoUpdate", "POST", (mData), signal);
            if (memoData) {
                setEditorData("")
                setEditingIndex(null); 
                setMemoDumy(null)

            }
        }
        fetchData();
        setShowEditor(false);
    };
    

    /* 메모삭제 */
    const handleDeleteMemo = (obj:OnBidMemo) => {
       
        if(!window.confirm('삭제하시겠습니까?')){
            return;
        }
        const fetchData = async (obj:OnBidMemo) => {
            const abortController = new AbortController();
            const signal = abortController.signal;
            const mData = {'idx':obj.idx}
            const memoData = await RequestApi("/api/onbid/memoDelete", "POST", (mData), signal);
            if (!memoData) {
                setMemo(prevMemo => prevMemo.filter(item => item.idx !== obj.idx));
            }
        }
        fetchData(obj);
    };


    /**
     * 메모 (수정/취소)
     * @param index 
     * @param status 
     * @returns 
     */
    const handleModifyMemo = (index: number, status: string,item:OnBidMemo|null) => {
        if (status === 'modify') {
            setEditingIndex(index); // 수정할 메모의 index를 상태로 설정
            setMemoDumy(item)
            return;
        }
    
        // 편집 모드에서 나와서 변경 내용을 적용
        setEditingIndex(null); 
        setMemo(prevMemo =>
            prevMemo.map((m, i) => 
                m.idx === memoDumy?.idx 
                ? { ...m, memo_contents: memoDumy?.memo_contents|| '' } 
                : m
            )
        );
        setMemoDumy(null)
    };


    /**
     * 입찰상태 등록
     * @param bididx 
     * @param dyasidx 
     * @param index
     */
    const handleOnBidStatusConfirm  = async (bididx:number|undefined,dyasidx:number,index:number) => {

        if (!selectRefs.current[index]) {
            return;
        }

        const formData = new FormData();

        // 이전 요청을 취소합니다.
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const abortController = new AbortController();
        const signal = abortController.signal;
        abortControllerRef.current = abortController;

        console.log('Selected Value:', selectRefs.current[index]?.value);
        let newQuery = {
            'bididx': bididx,
            'daysidx':dyasidx ,
            'sdate': '',
            'edate': '',
            'evalue': '',
            'deposit': '',
            'onbid_status':  selectRefs.current[index]?.value,
        };
        //'039'

        console.log("================<<< newQuery >>>==================")
        console.log(JSON.stringify(newQuery))
        let url = "/api/onbid/statusUpdate" ;
        try {
            const resultData = await RequestApi(url,"PUT",newQuery,signal);
            console.log("================<<< resultData >>>==================")
            console.log(JSON.stringify(resultData))
            console.log("================<<< resultData >>>==================")
            // 응답 데이터가 배열인지 확인
            if (resultData) {
                setDays(resultData);
                /* 페이징 계산 */
            } else {
                // setData([]);
                setError('데이터가 존재하지 않습니다.'); // 응답 데이터가 배열이 아닌 경우 빈 배열로 설정
                console.log('Received data is not an array.');
            }
        } catch (err) {
            setError(`An error occurred while fetching data:${err}`); // 오류 발생 시 빈 배열로 설정
            console.error('An error occurred while fetching data:', err);
        }
    };
    
    /* 첨부파일 열기 */
    const handleViewFile = (categroy:OnBidCategroy| undefined) => {
        // 서버에서 파일을 요청하여 새로운 탭에서 열기
       // const url = `${process.env.REACT_APP_API_URL}/api/onbid/${salenotice?.idx}`;
        const url = `http://localhost:8080/api/onbid/${categroy?.idx}`;
        window.open(url, '_blank','width=1024,height=900');
    };

    const openMap = (type: 'daum' | 'naver') => {
        const url = type === 'daum'
            ? `https://map.kakao.com/?q=${data?.addr1} ${data?.addr2}`
            : `https://map.naver.com/v5/search/${data?.addr1} ${data?.addr2}`;
        window.open(url, '_blank', 'width=800,height=600');
    };

    return (
        <div className="detail-page">
            {/* 1. 왼쪽으로 정렬 버튼형식 지목 */}
            <div className="button-section">
                <button className="detail-button">
                    <Image src={edit} alt="modify"/> 수정
                </button>
            </div>

            {/* 2. Box형 메모 */}
           
            <div className="box memo-box">
                <div className="memo-header">
                    <h3>메모</h3>
                   
                    <button
                        type="button"
                        className="add-memo-button"
                        onClick={handleAddMemo}
                        style={{ marginTop: '5px',textAlign: 'center',border: '1px solid #ddd' }}
                    >
                        <Image src={newfile} alt="add" />추가
                    </button>
                </div>
               
                {memo && Array.isArray(memo) && memo.length > 0
                 
                   ? memo?.map((item, index) => (
                        <div 
                        key={index} 
                        style={{ padding: '5px', marginTop: '2px', textAlign: 'left', border: '1px solid #ddd' }}
                         >
                        {editingIndex === index ? (
                            <div>
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={item.memo_contents}
                                    onChange={(event:any,editor:any) => {
                                  
                                        const data = editor.getData();
                                        setMemo(prevMemo =>
                                            prevMemo.map((m, i) => 
                                                i === index 
                                                ? { ...m, memo_contents: data } 
                                                : m
                                            )
                                        );
                                        // setMemoDumy를 여기서 호출하여 data를 업데이트합니다.
                                       
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
                                 <button type="button" onClick={() => handleModifyMemo(index,'cancel',null)} style={{ marginTop: '5px',textAlign: 'center',border: '0px solid #ddd' }}>
                                 <Image src={deletebtn} alt="delete"/>취소
                                 </button> &nbsp;
                                <button type="button" onClick={() => handleUpdateMemo(item)} style={{ marginTop: '5px',textAlign: 'center',border: '0px solid #ddd' }}>
                                <Image src={save} alt="add"/>저장
                                </button>
                            </div>
                        ) : (
                            <div>
                                <div dangerouslySetInnerHTML={{ __html: item.memo_contents || '' }} />
                                
                                <div className='wrapper'>
                                    <div>{item.regdate}</div>
                                    <div/>
                                    <div style={{ paddingRight: '5px', textAlign: 'right', border: '0px solid #ddd' }} >
                                        <Image 
                                            src={modify} 
                                            onClick={() => handleModifyMemo(index,'modify',item)} 
                                            alt="modify" 
                                            style={{ width: '38px', height: '38px' }}
                                        />
                                        <Image 
                                            src={minus} 
                                            onClick={() => handleDeleteMemo(item)} 
                                            alt="Minus"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    ))
                   : ("")
                   
                }
                {showEditor && (
                    <div className="editor-container">
                        <CKEditor
                            editor={ClassicEditor}
                            data={editorData}
                            onChange={handleEditorChange}
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

                        <button type="button" onClick={handleSaveMemo} style={{ marginTop: '5px',textAlign: 'center',border: '0px solid #ddd' }}>
                        <Image src={save} alt="add"/>저장
                        </button>
                    
                    </div>
                    
                )}
               
            </div>
           {/* 5. 입찰이력 */}
           <div className="bidding-history">
                <h3>입찰이력</h3>
                <div className="bidding-history-table">
                    <div className="bidding-history-header">
                        <div className="cell">회차</div>
                        <div className="cell">시작일자  ~  종료일자</div>
                        <div className="cell">감정가격(보증금)</div>
                        <div className="cell">진행상태</div>
                    </div>
                    {days?.map((item, index) => (
                        <div className="bidding-history-row" key={index}>
                            <div className="cell">{index + 1}회차</div>
                            <div className="cell">{item.sdate} ~ {item.edate}</div>
                            <div className="cell">{item.evalue}원 ({item.deposit}원)</div>
                            <div className="cell">
                                { onbidarray.includes(item.onbid_status) ? 
                                (
                                   item.onbid_status !== '039' ? (<span >{item.name}</span> ): <span className="onbid-color">{item.name}</span> 
                                ) :
                                ( (item.bblig > 0) ? ("") :(
                                    <div>
                                        <select
                                            ref={(el) => (selectRefs.current[index] = el)}
                                            style={{ marginBottom: '0px',marginRight: '2px', height: '30px', width: '25%' }}>
                                            <option value="">=선택=</option>
                                            {onBidStatusArray?.map(item => (
                                                <option key={item.idx} value={item.code}>{item.name}</option>
                                            ))}
                                        </select>
                                        <button
                                                type="button"
                                                className="add-memo-button"
                                                onClick={() => handleOnBidStatusConfirm(expensiveValue,item.daysidx,index)}>
                                            <Image src={check} alt="check" style={{width:'25px',height:'25px'}}/>
                                        </button>
                                    </div>  
                                        )         
                                )
                                }                   
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* 2. Box형 유의사항 */}
            <div className="box memo-box">
                <h3>유의사항</h3>
                <div dangerouslySetInnerHTML={{ __html: data?.note || '' }} />
            </div>

            {/* 3. 주소 (도로명 주소) */}
            <div className="address-section">
                <h3>주소</h3>
                <p> {data?.addr1} {data?.addr2} <span>({data?.rd_addr})</span></p>
            </div>

            {/* 4. Box형 항목 */}
            <div className="item-box1 address-section">
                <div className="row">
                    <div className="item1">
                        <span>토지면적:</span> {data?.ld_area}㎡ ({data?.ld_area_pyeong}평)
                    </div>
                    <div className="item1">
                        <span>건축면적:</span> {data?.build_area}㎡ ({data?.build_area_pyeong}평)
                    </div>
                </div>
                <div className="row">
                    <div className="item1">
                        <span>파산관제인명:</span> {data?.bruptcy_admin_name}
                    </div>
                    <div className="item1">
                        <span>파산관제인전화번호:</span> {data?.bruptcy_admin_phone}
                    </div>
                </div>
            </div>

            
            {/* 6. 공고문 */}
            <div className="box memo-box">
                <h3>공고문</h3>
                <p onClick={() => handleViewFile(salenotice)}>파일내용</p>
                {/* 파일 내용은 여기에 표시됩니다 */}
            </div>

            {/* 7. 첨부된 파일 버튼들 */}
            <div className="button-group">

                {category 
                  ? category.map( item => (<button className="detail-button" key={item.idx} onClick={()=>handleViewFile(item)}>{item.codename}</button>)) 
                  : ("")
                }

            </div>

            {/* 8. 지도 */}
            <div className="map-section">
                <div className="map">
                    <h3>다음지도</h3>
                    <button type="button" onClick={() => openMap('daum')}>지도 보기</button>
                </div>
                <div className="map">
                    <h3>네이버지도</h3>
                    <button type="button" onClick={() => openMap('naver')}>지도 보기</button>
                </div>
            </div>

            {/* 9. 위치/현황/기타 */}
            {/* <div className="additional-info">
                <h3>위치/현황/기타</h3>
                <div className="info-item">
                    <span>물건상세:</span> 토지 ㎡ / 건물 -
                </div>
                <div className="info-item">
                    <span>부대조건:</span> 도로가 좁음
                </div>
                <div className="info-item">
                    <span>기타:</span> 도시개발사업 단지조성중
                </div>
            </div> */}
        </div>
    );
};

export default OnBidDetailPage;
