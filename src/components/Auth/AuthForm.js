import { useState, useRef, useContext } from "react";
import { useHistory } from "react-router-dom";
import { axios } from "../../http/axios";

import AuthContext from "../../store/auth-context";
import classes from "./AuthForm.module.css";

const AuthForm = () => {
  const history = useHistory();
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const authCtx = useContext(AuthContext);

  // const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // const switchAuthModeHandler = () => {
  //   setIsLogin((prevState) => !prevState);
  // };

  const submitHandler = (event) => {
    event.preventDefault();
    // const enteredEmail = emailInputRef.current.value;
    // const enteredPassword = passwordInputRef.current.value;
    setIsLoading(true);
    login();
    // optional: Add validation
    //   setIsLoading(true);
    //   const url = "http://localhost:8080/api/v1/auth/login";
    //   fetch(url, {
    //     method: "POST",
    //     body: JSON.stringify({
    //       email: enteredEmail,
    //       password: enteredPassword,
    //     }),
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   })
    //     .then((res) => {
    //       setIsLoading(false);
    //       if (res.ok) {
    //         console.log(res);
    //         return res.json();
    //       } else {
    //         return res.json().then((data) => {
    //           let errorMessage = "Authentication failed!";
    //           // if (data && data.error && data.error.message) {
    //           //   errorMessage = data.error.message;
    //           // }
    //           throw new Error(errorMessage);
    //         });
    //       }
    //     })
    //     .then((data) => {
    //       console.log(data.token);
    //       authCtx.login(data.token);
    //       history.replace("/");
    //     })
    //     .catch((err) => {
    //       alert(err.message);
    //       setIsLoading(false);
    //     });
  };

  const login = () => {
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;
    
    const promise = axios.post("/api/v1/auth/login", {
      email: enteredEmail,
      password: enteredPassword,
    });

    promise
      .then((res) => {
        console.log(res.data.token);
        console.log(res.data.token);
        authCtx.login(res.data.token);
        history.replace("/");
        //setIsLoading(false);
      })
      .catch((err) => {
        //TODO: snackbar alert message
        alert(err.message);
        //setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
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
