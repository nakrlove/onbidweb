import React from 'react';

const FileViewer = () => {

    const handleViewFile = (fileId:number) => {
        // 서버에서 파일을 요청하여 새로운 탭에서 열기
        const url = `/files/${fileId}`;
        window.open(url, '_blank');
    };

    return (
        <div>
            <h1>File Viewer</h1>
            <button onClick={() => handleViewFile(1)}>View File 1</button>
            <button onClick={() => handleViewFile(2)}>View File 2</button>
            {/* 추가 파일 버튼을 여기서 구현할 수 있습니다. */}
        </div>
    );
};

export default FileViewer;