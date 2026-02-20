import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../context/User";
import Login from "../../components/Auth/Login/Login";
import Register from "../../components/Auth/Register/Register";
import "./Auth.scss";
import loading from "../../assets/loading.gif";

function Auth() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const {user, token, login, register} = useContext(UserContext);
  
  const handleToggle = () =>{
      setIsLoginMode(!isLoginMode);
  }
  const changeHandler = (e) =>{
      setFormData({...formData, [e.target.name]: e.target.value});
  };

  const submitHandler = async(e) =>{
    e.preventDefault();
    if(isLoginMode){
      setIsLoading(true);
      await login({...formData});
    } else{
      setIsLoading(true);
      await register({...formData});
    }
    setIsLoading(false);
  }
  
  useEffect(() => {
    window.scrollTo(0, 0); 
  }, []);


  return (
    <div className="authContainer">
      <main className="leftAuth">
        {isLoading && (
        <div className="loading">
            <img src={loading} alt="loading" />
        </div>
        )}
        {!isLoading && (isLoginMode ? (
          <Login submitHandler={submitHandler} changeHandler={changeHandler} />
        ) : (
          <Register submitHandler={submitHandler} changeHandler={changeHandler} />
        ))}
        <p className="toggleLog" onClick={handleToggle} >
          {isLoginMode ? "Don't have an account? Register" : "Have an account? Login"}
        </p>
      </main>
      <aside className="rightAuth"></aside>
    </div>
  )
}

export default Auth
