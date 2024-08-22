import axios from 'axios';
import React, { useState, useEffect, useCallback, useRef } from 'react';

import { RequestApi } from '../fetchapi/FetchApi';

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

interface OnBidCategroy {
    idx: number;
    bididx: number;
    code: string;
    filename: string;
    filetype: string;
    filesize: number;
    filepath: string;
    file: any;
    codename: string;
}

interface OnBidMemo {
    idx: number;
    memo_contents: string;
    regdate: string;
    bididx: number;
}

const FileViewer = () => {
    const [onBidStatusArray, setOnbidstatusarray] = useState<{ idx: number, code: string, name: string }[]>([]); /* 진행상태 */
    const [onbid, setOnbid] = useState<boolean>();
    const [days, setDays] = useState<OnbidDays[]>([]); // 초기 데이터는 빈 배열

    /* 입찰상태값 참조 */
    const selectRefs = useRef<(HTMLSelectElement | null)[]>([]);

    const handleViewFile = (fileId: number) => {
        // 서버에서 파일을 요청하여 새로운 탭에서 열기
        const url = `/files/${fileId}`;
        window.open(url, '_blank');
    };

    const fetchSelectOptions = useCallback(async () => {
        try {
            const response = await axios.post('/api/onbid/file-code?codes=037');
            setOnbidstatusarray(response.data);
        } catch (error) {
            console.error('Error fetching select options:', error);
        }
    }, []);

    /**
     * 입찰상태 등록
     */
    const handleOnBidStatusConfirm = (index:number) => {
        if (selectRefs.current[index]) {
            const selectedValue = selectRefs.current[index]?.value;
            console.log('Selected Value:', selectedValue);
        } else {
            console.error('Select reference is null');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const paramData = { 'bididx': 58 };
            if (paramData) {
                try {
                    const parsedData = paramData;

                    console.log(parsedData);
                    if (parsedData) {
                        /* 상세정보 조회 */
                        const abortController = new AbortController();
                        const signal = abortController.signal;
                        const data = await RequestApi("/api/onbid/onBidDetil", "POST", parsedData, signal);
                        console.log(JSON.stringify(data));
                        if (data) {
                            setDays(data?.bidDay);
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
      
    }, []);

    return (
        <div>
            <h1>File Viewer</h1>
            <button onClick={() => handleViewFile(1)}>View File 1</button>
            <button onClick={() => handleViewFile(2)}>View File 2</button>
            {days?.map((item, index) => (
                <div className="bidding-history-row" key={index}>
                    <div className="cell">{index + 1}회차</div>
                    <div className="cell">{item.sdate} ~ {item.edate}</div>
                    <div className="cell">{item.evalue}원 ({item.deposit}원)</div>
                    <div className="cell">
                        {onbid ? (
                            <span className="onbid-color">{item.name}</span>
                        ) : (
                            <div>
                                <select
                                    ref={(el) => (selectRefs.current[index] = el)}
                                    style={{ marginBottom: '0px', marginRight: '2px', height: '30px', width: '25%' }}
                                >
                                    <option value="">=선택=</option>
                                    {onBidStatusArray?.map(statusItem => (
                                        <option key={statusItem.idx} value={statusItem.code}>{statusItem.name}</option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    className="add-memo-button"
                                    onClick={() => handleOnBidStatusConfirm(index)}
                                >
                                    확인
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FileViewer;
