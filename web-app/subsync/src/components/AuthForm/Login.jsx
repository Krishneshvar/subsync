import './Login.css'
import { getLoginValidation } from '../../DataHandling'


function Login() {
  return(
    <>
    <div>
      <div class="container">
        <div class="heading">Sign In</div>
        <form action="" class="form">
          <input class="input" type="text" name="username" id="username" placeholder="Username" required />
          <input class="input" type="password" name="password" id="password" placeholder="Password" required />
          <span class="forgot-password"><a href=""> Forgot Password ? </a></span>
          <input class="login-button" type="submit" value="Sign In" />
        </form>
      </div>
    </div>
    </>
  )
}

export default Login
