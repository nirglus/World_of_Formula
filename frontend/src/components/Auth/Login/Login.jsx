function Login(props) {
  return (
    <div className="loginCont">
        <h2>Login to <span>World of Formula</span></h2>
        <p>Access your account to dive into the exhilarating world of Formula 1 diecast models.</p>
        <form className="authForm" onSubmit={props.submitHandler}>
            <input
                onChange={props.changeHandler}
                type="email"
                name="email"
                placeholder="example123@email.com"
                required
            />
            <input
                onChange={props.changeHandler}
                type="password"
                name="password"
                placeholder="Enter your password"
                required
            />
            <button type="submit">Sign In</button>
        </form>
    </div>
  )
}

export default Login
