import React, { useState, useEffect,useRef } from 'react';
import '../css/OnBidDetailPage.css'; // 스타일을 위한 CSS 파일

// import axios from 'axios';
import { RequestApi } from '../fetchapi/FetchApi';
import useFetchData   from '../hooks/useFetchData';
import { OnbidItem,OnbidDays,OnBidMemo,OnBidCategroy }  from '../interface/regst';
import { useLocation,useNavigate } from 'react-router-dom';
import { CKEditor }   from '@ckeditor/ckeditor5-react';
import ClassicEditor  from '@ckeditor/ckeditor5-build-classic';

import styled    from 'styled-components';

//import plus      from '../../assets/plus.png'; // 추가
import minus     from '../../assets/minus.png'; // 삭제
import modify    from '../../assets/modify.png'; //메모수정
import edit      from '../../assets/edit.png'; // 수정
import check     from '../../assets/check.png'; // 저장
import newfile   from '../../assets/new-file.png'; // 추가
import save      from '../../assets/save.png'; // 저장
import deletebtn from '../../assets/delete-minus.png'; // 저장

const Image = styled.img`
  width: 20px;
  height: 20px;
`;

const OnBidDetailPage = () => {
   

    const [memoDumy  , setMemoDumy]   = useState<OnBidMemo|null>(); //메모
    const [showEditor, setShowEditor] = useState<boolean>(false); // CKEditor 표시 상태
    const [editorData, setEditorData] = useState<string>(''); // CKEditor 데이터
    // const [error,setError]  = useState<string>('');

    // const [mbididx  , setMbididx] = useState<number>();
    const [onbid    , setOnbid]      = useState<boolean>();
    const [salenotice,setSalenotice] = useState<OnBidCategroy>();
    const navigate = useNavigate(); // useNavigate 훅 사용
    /* 입찰상태값 참조 */
    const selectRefs = useRef<(HTMLSelectElement | null)[]>([]);
    /** 메모수정 index 선택상태 */
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    // 파라메터 넘겨받기 시작
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const paramData = queryParams.get('data');
    // const abortControllerRef = useRef<AbortController | null>(null);

    // onbidarray: 체크할 상태 코드를 배열로 정의합니다.
    const onbidarray = ['039', '040', '041','-01'];
    const {  data ,days,setDays, replaceDays, appendDays
           , memos ,setMemos
           , status
           , bididx
           , attchfile
           , loading
           , error } = useFetchData<OnbidItem,OnbidDays,OnBidMemo,OnBidCategroy>();
   
    useEffect(() => {

    console.log(` #### ${JSON.stringify(memos)}`)

        if(days){
        //    // days.some(): days 배열에 있는 각 item의 onbid_status가 onbidarray 포함되어 있는지 확인합니다. 하나라도 포함되어 있으면 true를 반환합니다.
           const hasOnBidStatus = days.some(item => onbidarray.includes(item.onbid_status))
           if(hasOnBidStatus){
              setOnbid(true);
           }
        }

        if(attchfile) { /* 매각공고 */
            let sale = (attchfile.find((item) =>  item.code === '041' ))
            setSalenotice(sale)
        }
     
    },[days,attchfile]);


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

            const mData = {'bididx':bididx,'memo_contents':editorData}
            const memoData = await RequestApi("/api/onbid/momeSave", "POST", (mData));
            if (memoData) {
                setMemos((prevMemo => [...prevMemo,memoData]));
                setEditorData("")
            }
        }
        fetchData();
        setShowEditor(false);
    };

    /* 메모수정 */
    const handleUpdateMemo = (item:OnBidMemo) => {
        const fetchData = async () => {
            const mData = {'idx':item.idx,'memo_contents':item.memo_contents}
            const memoData = await RequestApi("/api/onbid/memoUpdate", "POST", (mData));
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
            const mData = {'idx':obj.idx}
            const memoData = await RequestApi("/api/onbid/memoDelete", "POST", (mData));
            if (!memoData) {
                setMemos(prevMemo => prevMemo.filter((item: OnBidMemo)  => item.idx !== obj.idx));
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
        setMemos(prevMemo =>
            prevMemo.map((m: OnBidMemo) => 
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
    const handleOnBidStatusConfirm  = async (dyasidx:number,index:number) => {

        if (!selectRefs.current[index]) {
            return;
        }

        const formData = new FormData();
        let newQuery = {
            'bididx': bididx,
            'daysidx':dyasidx ,
            'edate': '',
            'evalue': '',
            'deposit': '',
            'onbid_status':  selectRefs.current[index]?.value,
        };
        //'039'

        let url = "/api/onbid/statusUpdate" ;
        try {
            const resultData = await RequestApi(url,"PUT",newQuery);
            // 응답 데이터가 배열인지 확인
            if (resultData) {
                replaceDays(resultData);
                /* 페이징 계산 */
            } else {
                // setData([]);
                //setError('데이터가 존재하지 않습니다.'); // 응답 데이터가 배열이 아닌 경우 빈 배열로 설정
                console.log('Received data is not an array.');
            }
        } catch (err) {
            //setError(`An error occurred while fetching data:${err}`); // 오류 발생 시 빈 배열로 설정
            console.error('An error occurred while fetching data:', err);
        }
    };
    
    /* 첨부파일 열기 */
    const handleViewFile = (categroy:OnBidCategroy| undefined) => {
        // 서버에서 파일을 요청하여 새로운 탭에서 열기
       // const url = `${process.env.REACT_APP_API_URL}/api/onbid/${salenotice?.idx}`;
        const url = `${process.env.REACT_APP_API_URL}/api/onbid/${categroy?.idx}`;
        window.open(url, '_blank','width=1024,height=900');
    };

   
    const handleDetailClick = (data: object) => {
        const jsonData = JSON.stringify(data);
        const encodedData = encodeURIComponent(jsonData);
        navigate(`/onbid-regst?data=${encodedData}&popup=true`,{ replace: true }); // 등록 화면으로 이동
    };


    // const openMap = (type: 'daum' | 'naver' | 'onbid') => {
    //     const url = type === 'daum'
    //         ? `https://map.kakao.com/?q=${data?.addr1} ${data?.addr2}`
    //         : `https://map.naver.com/v5/search/${data?.addr1} ${data?.addr2}`;
    //         //: `https://www.eum.go.kr/web/ar/lu/luLandDet.jsp?mode=search&selGbn=umd&isNoScr=script&pnu=${data?.addr1}' ,'eum','scrollbars=yes, resizable=yes, top=0, left='+(window.screenX+1350)+', width=1280, height=1200')`
    //     window.open(url, '_blank','scrollbars=yes, resizable=yes, top=0, left='+(window.screenX+1350)+',width=1280,height=1200');
    // };    

    const openMap = (URL: string) => {
        const url = URL
        //   const url = `/onbid-detail?data=${encodedData}&popup=true`
        window.open(url, 'map-info','scrollbars=yes, resizable=yes, top=0, left='+(window.screenX+1350)+',width=1280,height=1200');
    };    
    
    return (
        <div className="detail-page">
            {/* 1. 왼쪽으로 정렬 버튼형식 지목 */}
            <div className="button-section">
                <button className="detail-button" onClick={() => handleDetailClick({ 'bididx':bididx, 'modify':true })}>
                    <Image src={edit} alt="modify"/> 수정
                </button>
            </div>
            {/* 3. 주소 (도로명 주소) */}
            <div className="address-section">
                <h3>주소</h3>
                <p> {data?.addr1} {data?.addr2} {data?.rd_addr ? <span>({data?.rd_addr})</span> :("")}</p>
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
               
                {memos && Array.isArray(memos) && memos.length > 0
                 
                   ? memos?.map((item, index) => (
                        <div key={index} style={{ padding: '5px', marginTop: '2px', textAlign: 'left', border: '1px solid #ddd' }} >
                        {editingIndex === index ? (
                            <div>
                                <CKEditor
                                    editor={ClassicEditor}
                                    data={item.memo_contents}
                                    onChange={(event:any,editor:any) => {
                                  
                                        const data = editor.getData();
                                        setMemos(prevMemo =>
                                            (prevMemo as OnBidMemo[]).map((m: OnBidMemo , i)  => 
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
                        <div className="cell">입찰일자</div>
                        <div className="cell">감정가격(보증금)</div>
                        <div className="cell">진행상태</div>
                    </div>
                    {days?.map((item, index) => (
                        <div className="bidding-history-row" key={index}>
                            <div className="cell">{index + 1}회차</div>
                            <div className="cell">{item.edate}</div>
                            <div className="cell">{item.evalue}원 ({item.deposit}원)</div>
                            <div className="cell">
                                { onbidarray.includes(item.onbid_status) ? 
                                (
                                   (item.onbid_status !== '039')  ? (<span >{item.name}</span> ): <span className="onbid-color">{item.name}</span> 
                                ) :
                                ( 
                                    // (item.bblig > 0) ? ("") :
                                    (
                                        <div> 
                                            <select
                                                ref={(el) => (selectRefs.current[index] = el)}
                                                style={{ marginBottom: '0px',marginRight: '2px', height: '30px', width: '25%' }}>
                                                <option value="">=선택=</option>
                                                {status?.map(item => (
                                                    <option key={item.idx} value={item.code}>{item.name}</option>
                                                ))}
                                            </select>
                                            <button type="button"
                                                    className="add-memo-button"
                                                    onClick={() => handleOnBidStatusConfirm(item.daysidx,index)}>
                                                    {/* onClick={() => handleOnBidStatusConfirm(expensiveValue,item.daysidx,index)}> */}
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
            {/* <div className="box memo-box">
                <h3>공고문</h3>
                <p onClick={() => handleViewFile(salenotice)}>파일내용</p>
            
            </div> */}


            <div className="box memo-box">
                <div className="memo-header">
                    <h3>토지이용계획확인원</h3>
                    <button type="button" onClick={() => openMap(`https://www.eum.go.kr/web/ar/lu/luLandDet.jsp?mode=search&selGbn=umd&isNoScr=script&pnu=${data?.pnu}`)}>토지이용계획확인원</button>
                </div>
               
                <div style={{ padding: '5px', marginTop: '2px', textAlign: 'left', border: '1px solid #ddd' }}>
                        <div>
                            <div className='wrapper' dangerouslySetInnerHTML={{ __html: data?.national_land_planning_use_laws || '' }} />
                        </div><hr style={{ margin: '2px 0' }} />
                        <div>
                            <div className='wrapper' dangerouslySetInnerHTML={{ __html: data?.other_laws || '' }} />
                        </div><hr style={{ margin: '2px 0' }} />
                        <div>
                            <div className='wrapper' dangerouslySetInnerHTML={{ __html: data?.enforcement_decree || '' }} />
                        </div>
            
                </div>
            </div>




            {/* 7. 첨부된 파일 버튼들 */}
            <div className="button-group">

                {attchfile 
                  ? attchfile.map( item => (<button className="detail-button" key={item.idx} onClick={()=>handleViewFile(item)}>{item.codename}</button>)) 
                  : ("")
                }

            </div>

            {/* 8. 지도 */}
            <div className="map-section">
                <div className="map">
                    <h3>지도</h3>
                    <button type="button" onClick={() => openMap(`https://map.kakao.com/?q=${data?.addr1} ${data?.addr2}`)}>다음 보기</button>&nbsp;
                    <button type="button" onClick={() => openMap(`https://map.naver.com/v5/search/${data?.addr1} ${data?.addr2}`)}>네이버 보기</button>&nbsp;
                    <button type="button" onClick={() => openMap(`https://disco.re`)}>disco</button>&nbsp;
                </div>
                {/* <div className="map">
                    <h3>네이버지도</h3>
                   
                </div> */}
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
