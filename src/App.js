import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Blog from "./pages/Blog";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Login from "./pages/Login";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "./firebase-config";
import logo from "./assets/images/logo.PNG";
import { FaFacebookF, FaPinterestP } from "react-icons/fa";
import { AiOutlineTwitter, AiOutlineInstagram } from "react-icons/ai";
function App() {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));
  const [user, setUser] = useState(localStorage.getItem("User"));
  //const [loginName, setLoginName] = useState(localStorage.getItem("isAuth"));

  const signUserOut = () => {
    signOut(auth).then(() => {
      localStorage.clear();
      setIsAuth(false);
      window.location.pathname = "/login";
    });
  };
  console.log(isAuth);
  
  return (
    <Router>
      <div className="headerWrapper">
        <div className="socialIcons">
          <span>
            <FaFacebookF />
          </span>
          <span>
            <AiOutlineTwitter />
          </span>
          <span>
            <FaPinterestP />
          </span>

          <span>
            <AiOutlineInstagram />
          </span>
        </div>
        <div className="logoWrapper">
          <Link to="/">
            <img src={logo} />
          </Link>
        </div>
      </div>
      <nav>
        <div style={{width:"500px"}}></div>
        <div className="link">
        <Link to="/"> Home </Link>
        <Link to="/blog"> Blog </Link>
        {!isAuth ? (
          <Link to="/login"> Login </Link>
        ) : (
          <>
          <Link to="/createpost"> Create Post </Link>
         
            <div className="logout">
              <button onClick={signUserOut}> Log Out</button>
              </div>
            
          </>
        )}
        </div>
         <div style={{width:"100px"}}></div>
          <div className="welcome">
      Welcome back: {user}</div>
            
       
        </nav>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog isAuth={isAuth} />} />
        <Route path="/createpost" element={<CreatePost isAuth={isAuth} />} />
        <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
      </Routes>
    </Router>
  );
}

export default App;
