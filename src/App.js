// import logo from './logo.svg';
// import './App.css';
import ViewRegst from '../src/components/ViewRegst.tsx';
import Header from '../src/components/widget/Header.tsx';
import CodeList from '../src/components/widget/CodeList.tsx';
import CodeRegist from '../src/components/widget/CodeRegist.tsx';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CustomNavBar from '../src/components/CustomNavBar.tsx';
import ThemeProvider from 'react-bootstrap/ThemeProvider';

function App() {
  return (
    // <div className="App">
    <ThemeProvider dir="rtl" breakpoints={['sm', 'xs', 'xxs']}  minBreakpoint="xs">
    <Router>
      <div >
        {/* <header className="App-header">
        </header> */}
        {/* <Header>파산공매</Header> */}
        {/* <main><ViewRegst /></main> */}
        <CustomNavBar/>
        <Routes>
          <Route path="/home" element={<ViewRegst />}/>
          <Route path="/file-code" element={<CodeList />}/>
          <Route path="/code-regist" element={<CodeRegist />} />
          {/* <Route path="/day/:day" element={<Day />} />
          <Route path="/create_word" element={<CreateWord />} />
          <Route path="/create_day" element={<CreateDay />} />
          <Route path="*" element={<EmptyPage />} />
    */}
        </Routes>


        <footer>SCC</footer>
      </div >
    </Router>
    </ThemeProvider>
  );
}

export default App;
