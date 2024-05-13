import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Homepage from './Homepage/Homepage';
import Login from './Login/Login';
import Database from './Database/Database';
import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';
import AccessForbidden from './AccessForbidden/AccessForbidden';
import Register from './Register/Register';


function App() {
  
  return (
    <div className="App">
    <BrowserRouter>
    <Navbar/>
    <Routes>
      <Route path='/' element={<Homepage/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/database' element={<Database/>}/>
      <Route path='/accessforbidden' element={<AccessForbidden/>}/>
    </Routes>
    <Footer/>
    </BrowserRouter>
    </div>
  );
}

export default App;
