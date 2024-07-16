import logo from './logo.svg';
// import './App.css';
import ViewRegst from '../src/components/ViewRegst.tsx'
import Header from '../src/components/widget/Header.tsx'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }



function App() {
  return (
    // <div className="App">
    <Router>
      <div >
        {/* <header className="App-header">
        </header> */}
        <Header>파산공매</Header>
        {/* <main><ViewRegst /></main> */}

        <Routes>
          <Route path="/" element={<ViewRegst />}/>
          {/* <Route path="/day/:day" element={<Day />} />
          <Route path="/create_word" element={<CreateWord />} />
          <Route path="/create_day" element={<CreateDay />} />
          <Route path="*" element={<EmptyPage />} /> */}
   
        </Routes>


        <footer>SCC</footer>
      </div >
    </Router>
  );
}

export default App;
