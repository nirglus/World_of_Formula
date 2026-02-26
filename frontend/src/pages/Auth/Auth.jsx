import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/User";
import Login from "../../components/Auth/Login/Login";
import Register from "../../components/Auth/Register/Register";
import "./Auth.scss";

function Auth() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const { login, register, loginDemo } = useContext(UserContext);

  const handleToggle = () => {
    setIsLoginMode(!isLoginMode);
  };

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (isLoading || isDemoLoading) return;
    setIsLoading(true);
    try {
      if (isLoginMode) {
        await login({ ...formData });
      } else {
        await register({ ...formData });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onDemoLogin = async () => {
    if (isDemoLoading || isLoading) return;
    setIsDemoLoading(true);
    try {
      await loginDemo();
    } finally {
      setIsDemoLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="authContainer">
      <main className="leftAuth">
        <nav className="authNavTop" aria-label="Auth navigation">
          <Link to="/" className="authNavLink">Back to Home</Link>
          <Link to="/products" className="authNavLink">Back to Products</Link>
        </nav>

        {isLoginMode ? (
          <Login
            submitHandler={submitHandler}
            changeHandler={changeHandler}
            onToggleMode={handleToggle}
            isLoading={isLoading}
            isDemoLoading={isDemoLoading}
            onDemoLogin={onDemoLogin}
          />
        ) : (
          <Register
            submitHandler={submitHandler}
            changeHandler={changeHandler}
            onToggleMode={handleToggle}
            isLoading={isLoading}
            isDemoLoading={isDemoLoading}
            onDemoLogin={onDemoLogin}
          />
        )}
      </main>
      <aside className="rightAuth" aria-hidden="true" />
    </div>
  );
}

export default Auth;
