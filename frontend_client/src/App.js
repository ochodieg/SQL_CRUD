// import logo from './logo.svg';
// import './App.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

//import { useEffect } from "react";
import Add from "./pages/Add";
import Books from "./pages/Books";
import Update from "./pages/Update";
import FileUpload from './pages/FileUpload'; //using fileupload in add/update routes, this import is for testing file upload on a temp route only
import "./style.css"


////////////////////////////////////////////////////


function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Books/>}/>
          <Route path="/add" element={<Add/>}/>
          <Route path="/update/:id" element={<Update/>}/>


          <Route path="/fileupload" element={<FileUpload/>}/> 
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
