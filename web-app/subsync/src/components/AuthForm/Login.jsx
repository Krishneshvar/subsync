import './Login.css'
import { useNavigate } from 'react-router-dom';

function Login() {

  const navigate = useNavigate();
  const handleLogin = () => navigate("/dashboard")

  return (
    <>
    <div className="login-display">
      <div className="container">
        <div className="heading">Sign In</div>
        <form className="form">
          <input required className="input" type="text" name="username" id="usernmae" placeholder="Username" />
          <input required className="input" type="password" name="password" id="password" placeholder="Password" />
          <span className="forgot-password">
            <a>Forgot Password ?</a>
          </span>
          <input className="login-button" type="submit" value="Sign In" onClick={handleLogin}/>
        </form>
      </div>
    </div>
    </>
  )
}

export default Login
