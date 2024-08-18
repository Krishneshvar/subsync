import './Login.css'

function Login() {
  return(
    <>
    <div>
        <div class="container">
            <div class="heading">Sign In</div>
            <form action="" class="form">
              <input required="" class="input" type="email" name="email" id="email" placeholder="E-mail"/>
              <input required="" class="input" type="password" name="password" id="password" placeholder="Password"/>
              <span class="forgot-password"><a href="#">Forgot Password ?</a></span>
              <input class="login-button" type="submit" value="Sign In" />
              
            </form>
            <div class="social-account-container">
                <span class="title">Or Sign in with</span>
              </div>
              <span class="agreement"><a href="#">Learn user licence agreement</a></span>
          </div>
    </div>
    </>
  )
}

export default Login
