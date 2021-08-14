import React, { useState } from "react";

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  userRole: "",
  userId:"",
  username:"",
  login: (token) => {},
  logout: () => {},
});

export const AuthContextProvider = (props) => {
  const initialToken = localStorage.getItem("token");
  const [token, setToken] = useState(initialToken);
  const initialUserRole = localStorage.getItem("userRole");
  const [userRole, setUserRole] = useState(initialUserRole);
  const initialUserId = localStorage.getItem("userId");
  const [userId, setUserId] = useState(initialUserId);
  const initialUsername = localStorage.getItem("username");
  const [username, setUsername] = useState(initialUsername);

  const userIsLoggedIn = !!token;

  const loginHandler = (token) => {
    setToken(token);
    localStorage.setItem("token", token);
    setUserRole(parseJwt(token).role);
    localStorage.setItem("userRole", parseJwt(token).role);
    setUserId(parseJwt(token).userId);
    localStorage.setItem("userId", parseJwt(token).userId);
    setUsername(parseJwt(token).username);
    localStorage.setItem("username", parseJwt(token).username);
  };

  const logoutHandler = () => {
    setToken(null);
    localStorage.removeItem("token");
    setUserId(null);
    localStorage.removeItem("userId");
    setUsername(null);
    localStorage.removeItem("username");
    setUserRole(null);
    localStorage.removeItem("useRole");
  };

  const parseJwt = (token) => {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  };

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
    userRole: userRole,
    userId: userId,
    username: username,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
