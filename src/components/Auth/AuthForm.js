import { useContext, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { axios } from "../../http/axios";
import AuthContext from "../../store/auth-context";
import classes from "./AuthForm.module.css";


const AuthForm = () => {
  const history = useHistory();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const authCtx = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = (event) => {
    event.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    login(enteredEmail, enteredPassword);
    setIsLoading(true);
  };

  const login = (enteredEmail, enteredPassword) => {
    const promise = axios.post("/api/v1/auth/login", {
      email: enteredEmail,
      password: enteredPassword,
    });

    promise
      .then((res) => {
        authCtx.login(res.data.token);
        setIsLoading(false);
        history.replace("/");
      })
      .catch((err) => {
        //TODO: snackbar alert message
        setIsLoading(false);
        alert(err.message);
      })
  };

  return (
    <section className={classes.auth}>
      <h1>Login</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            id="password"
            required
            ref={passwordInputRef}
          />
        </div>
        <div className={classes.actions}>
          {!isLoading && <button>Login</button>}
          {isLoading && <p>Sending request...</p>}
          <button type="button" className={classes.toggle}></button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
