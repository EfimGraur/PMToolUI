import React, { useContext, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { axios } from "../../http/axios";
import AuthContext from "../../store/auth-context";
import classes from "./AuthForm.module.css";
import CustomizedSnackbar, {MessageType} from "../Snackbar/CustomSnackbar";
import {LOGIN_URL} from "../../constants/resourceConstants";


const AuthForm = () => {
  const history = useHistory();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const authCtx = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);
  const [alertRendered, setAlertRendered] = useState(false);
  const [alertMessageType, setAlertMessageType] = useState("")

  const submitHandler = (event) => {
    event.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    login(enteredEmail, enteredPassword);
    setIsLoading(true);
  };

  const login = (enteredEmail, enteredPassword) => {
    setAlertRendered(false)
    const promise = axios.post(LOGIN_URL, {
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
        if(err.response.status === 401){
          setAlertRendered(true);
          setAlertMessageType(MessageType.UNAUTHORIZED)
          setIsLoading(false);
          return
        }
        setIsLoading(false);
        setAlertRendered(true);
        setAlertMessageType(MessageType.ERROR)
      })
  };

  return (
    <section className={classes.auth}>
      <CustomizedSnackbar
          messageType={alertMessageType}
          render={alertRendered}
      />
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
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
