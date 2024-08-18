import React, { useState, useEffect,useCallback,useRef ,useMemo} from 'react';
import '../css/DetailPage.css'; // 스타일을 위한 CSS 파일
import { RequestApi } from '../fetchapi/FetchApi';
import { useLocation } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import styled from 'styled-components';
import plus from '../../assets/plus.png'; // 경로는 파일의 위치에 따라 조정
import edit from '../../assets/edit.png'; // 경로는 파일의 위치에 따라 조정
import check from '../../assets/check.png'; // 경로는 파일의 위치에 따라 조정
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
    memo: string;
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
}

const DetailPage = () => {
    const [data, setData] = useState<OnbidItem>(); // 초기 데이터는 빈 배열
    const [days, setDays] = useState<OnbidDays[]>([]); // 초기 데이터는 빈 배열
    const [showEditor, setShowEditor] = useState<boolean>(false); // CKEditor 표시 상태
    const [editorData, setEditorData] = useState<string>(''); // CKEditor 데이터
    const [error,setError]  = useState<string>('');

    const [mbididx, setMbididx] = useState<number>();
    const [onbid, setOnbid] = useState<boolean>();


    // 파라메터 넘겨받기 시작
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const paramData = queryParams.get('data');
    const abortControllerRef = useRef<AbortController | null>(null);

    const expensiveValue = useMemo(() => {
      // 가상의 복잡한 계산
      console.log('Expensive calculation');
      return mbididx;
    }, [mbididx]);

    useEffect(() => {
        const fetchData = async () => {
            if (paramData) {
                try {
                    const parsedData = JSON.parse(paramData);
                    if (parsedData) {
                        const abortController = new AbortController();
                        const signal = abortController.signal;
                        const data = await RequestApi("/api/onbid/onbidLDetil", "POST", parsedData, signal);
                        if (data) {
                            setData(data?.bidMap);
                            setDays(data?.bidDay);
                            setMbididx(parsedData.bididx)
                        }
                        return () => abortController.abort(); // Cleanup function to abort the request
                    }
                } catch (error) {
                    console.error('Failed to parse JSON data from query string:', error);
                }
            }
        };
        fetchData();
    }, [paramData]);

    useEffect(() => {
        if(days){
            const firstOnbid = days.find(item => item.onbid_status === '039');
            if(firstOnbid?.onbid_status === '039') setOnbid(true)
        }
    },[days]);


    const handleAddMemo = () => {
        setShowEditor(true);
    };

    const handleEditorChange = (event: any, editor: any) => {
        const data = editor.getData();
        setEditorData(data);
    };

    const handleSaveMemo = () => {
        if (data) {
            setData({ ...data, memo: editorData });
        }
        setShowEditor(false);
    };

    const handleMark  = async (bididx:number|undefined,dyasidx:number) => {

        const formData = new FormData();

        // 이전 요청을 취소합니다.
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        const abortController = new AbortController();
        const signal = abortController.signal;
        abortControllerRef.current = abortController;

       
        let newQuery = {
            'bididx': bididx,
            'daysidx':dyasidx ,
            'sdate': '',
            'edate': '',
            'evalue': '',
            'deposit': '',
            'onbid_status': '039',
        };

      
        let url = "/api/onbid/statusUpdate" ;
        try {
            const resultData = await RequestApi(url,"PUT",newQuery,signal);
            console.log("================<<< resultData >>>==================")
            console.log(JSON.stringify(paramData))
            console.log(JSON.stringify(resultData))
            console.log("================resultData==================")
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
    
    const handleViewFile = (fileId:number) => {
        // 서버에서 파일을 요청하여 새로운 탭에서 열기
        const url = `http://localhost:8080/api/onbid/${fileId}`;
        window.open(url, '_blank');
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
                    >
                        <Image src={plus} alt="modify"/>
                    </button>
                </div>
                <p>{data?.memo}</p>
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
                        <button type="button" onClick={handleSaveMemo}>저장</button>
                    </div>
                )}
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
                                 { onbid ? (<span className="onbid-color">{item.name}</span>) :
                                           (
                                            <button
                                                    type="button"
                                                    className="add-memo-button"
                                                    onClick={() => handleMark(expensiveValue,item.daysidx)}>
                                                 <Image src={check} alt="check" style={{width:'40px',height:'40px'}}/>
                                            </button>

                                           )
                                 }
                                 
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* 6. 공고문 */}
            <div className="box memo-box">
                <h3>공고문</h3>
                <p onClick={() => { handleViewFile(42)}}>파일내용</p>
                {/* 파일 내용은 여기에 표시됩니다 */}
            </div>

            {/* 7. 버튼들 */}
            <div className="button-group">
                <button className="detail-button">토지이용계획확인원</button>
                <button className="detail-button">토지대장</button>
                <button className="detail-button">건축물대장</button>
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
            <div className="additional-info">
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
            </div>
        </div>
    );
};

export default DetailPage;
