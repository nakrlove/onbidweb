// import logo from './logo.svg';
// import './App.css';
import OnBidRegst from '../src/components/OnBidRegst';
import OnBidList from '../src/components/widget/OnBidList';
// import Header from '../src/components/widget/Header.tsx';
import CodeList from '../src/components/widget/CodeList';
import CodeRegist from '../src/components/widget/CodeRegist';
import Login from '../src/components/widget/Login';
import OnBidDetailPage from './components/widget/OnBidDetailPage';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import CustomNavBar from '../src/components/CustomNavBar';
import ThemeProvider from 'react-bootstrap/ThemeProvider';

/** 등록화면의 관심목록 selectbox와 관심목록팝업화면 데이터 공유하기위해 provider적용 */
import { CategoryProvider } from './components/provider/CategoryProvider';

import FileViewer from './components/widget/FileViewer';

function App() {
  return (
    // <div className="App">
    <ThemeProvider dir="rtl" breakpoints={['sm', 'xs', 'xxs']} minBreakpoint="xs">
      <Router>
        <Main />
      </Router>
    </ThemeProvider>
  );
}

function Main() {
  const location = useLocation();
  const isPopup = new URLSearchParams(location.search).get('popup') === 'true';

  return (
    <div>
      {/* 조건부로 CustomNavBar 렌더링 */}
      {!isPopup && <CustomNavBar />}
      <CategoryProvider>
        <Routes>
          <Route path="/onbid-list" element={<OnBidList />} />
          <Route path="/onbid-regst" element={<OnBidRegst />} />
          <Route path="/onbid-detail" element={<OnBidDetailPage />} />
          <Route path="/file-code" element={<CodeList />} />
          <Route path="/code-regist" element={<CodeRegist />} />
          <Route path="/code-file" element={<FileViewer />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/day/:day" element={<Day />} />
          <Route path="/create_word" element={<CreateWord />} />
          <Route path="/create_day" element={<CreateDay />} />
          <Route path="*" element={<EmptyPage />} />
        */}
        </Routes>
      </CategoryProvider>

      <footer>{}</footer>
    </div>
  );
}

export default App;
