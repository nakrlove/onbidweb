import React, { useState, useEffect, useCallback } from 'react';
import '../css/DetailPage.css'; // 스타일을 위한 CSS 파일
import { RequestApi } from '../fetchapi/FetchApi';
import { useNavigate,useLocation } from 'react-router-dom';

// 데이터 타입 정의
interface OnbidItem {
    idx: number;
    addr1 :  string ,
    addr2 :  string ,
    regdate : string ,
    items : string,
    ld_area :  string ,
    ld_area_pyeong:number,
    build_area :  string ,
    build_area_pyeong:number,
    rd_addr :  string ,
    streeaddr2 : string,
    bruptcy_admin_name :  string ,
    bruptcy_admin_phone :  string ,
    renter :  string ,
    estateType :  string ,
    disposal_type :  string ,
    note :  string ,
    land_classification :  string ,
    progress_status : string,
    memo: string,
    land_classification_name: string
}


// 데이터 타입 정의
interface OnbidDays{
   
    sdate: string,
    edate: string,
    deposit: string,
    evalue: string,
    bididx: number,
    daysidx: number,
}
const DetailPage = () => {

    const [data, setData] = useState<OnbidItem>(); // 초기 데이터는 빈 배열
    const [days, setDays] = useState<OnbidDays[]>([]); // 초기 데이터는 빈 배열
    //파라메터 넘겨받기 시작 
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const paramData = queryParams.get('data');

    useEffect(() => {
        const fetchData = async () => {
            if (paramData) {

                try {

                    const parsedData = JSON.parse(paramData);
                    if (parsedData) {
                        const abortController = new AbortController();
                        const signal = abortController.signal;
                        const data = await RequestApi("/api/onbid/onbidLDetil","POST",parsedData,signal);
                        if (data) {
                            console.log(JSON.stringify(data))

                            setData(data?.bidMap)
                            setDays(data?.bidDay)
                            //return;
                        } 
                        return () => abortController.abort(); // Cleanup function to abort the request
                    }
                } catch (error) {
                    console.error('Failed to parse JSON data from query string:', error);
                }
            }
        }
        fetchData()
   }, [paramData]);


  return (
    <div className="detail-page">
      {/* 1. 왼쪽으로 정렬 버튼형식 지목 */}
      <div className="button-section">
        <button className="detail-button">수정</button>
      </div>

      {/* 2. Box형 메모 */}
      <div className="box memo-box">
        <h3>메모</h3>
        <p>{data?.memo}</p>
      </div>

      {/* 2. Box형 유의사항 */}
      <div className="box notes-box">
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
        {days?.map( (item ,index) => (
            <div className="bidding-round" key={index}>
              <div className="round-number">{index + 1}회차</div>
              <div className="round-details">{item.sdate} ~ {item.edate} {item.evalue}원 ({item.deposit}원)</div>
            </div>
            ))
        }
      </div>
    
      {/* 6. 공고문 */}
      <div className="file-box">
        <h3>공고문</h3>
        <p>파일내용</p>
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
          {/* 다음지도 내용 */}
        </div>
        <div className="map">
          <h3>네이버지도</h3>
          {/* 네이버지도 내용 */}
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
