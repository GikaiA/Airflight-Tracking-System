import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Homepage from './Homepage/Homepage';
import Login from './Login/Login';
import Database from './Database/Database';
import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';


function App() {
  return (
    <div className="App">
    <BrowserRouter>
    <Navbar/>
    <Routes>
      <Route path='/' element={<Homepage/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/database' element={<Database/>}/>
    </Routes>
    <Footer/>
    </BrowserRouter>
    </div>
  );
}

export default App;
