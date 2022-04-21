
import { Route, Routes } from 'react-router-dom'

import Header from "./header/Header"
import Main from "./components/Main"
import About from "./components/About"
import SignUp from "./components/SignUp"
import './App.css'

function App() {
  return (
    <div className="App">
      <header className='fixedheader'>
        <Header />
      </header>
      <Routes>
        <Route exact path="/" element={<Main />} />
        <Route path="/about" element={<About />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </div>
  );
}

export default App;
