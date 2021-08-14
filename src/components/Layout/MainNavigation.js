import { useContext } from "react";
import { Link } from "react-router-dom";
import { ADMIN_ROLE, PM_ROLE } from "../../constants/roleConstants";
import AuthContext from "../../store/auth-context";
import classes from "./MainNavigation.module.css";

const MainNavigation = () => {
  const authCtx = useContext(AuthContext);

  const isLoggedIn = authCtx.isLoggedIn;
  const userRole = authCtx.userRole;
  const loggoutHandler = () => {
    authCtx.logout();
  };
  const isAdmin = userRole === ADMIN_ROLE;
  const isPM = userRole === ADMIN_ROLE || userRole === PM_ROLE;

  return (
    <header className={classes.header}>
      <Link to="/">
        <div className={classes.logo}>PMTool</div>
      </Link>
      <nav>
        <ul>
          {isLoggedIn && (
            <ul>
              {isAdmin && (
                <li>
                  <Link to="/users">Users</Link>
                </li>
              )}
              {isPM && (
                <li>
                  <Link to="/projects">Projects</Link>
                </li>
              )}
              <li>
                <Link to="/tasks">Tasks</Link>
              </li>
              <li>
                <button onClick={loggoutHandler}>Logout</button>
              </li>
            </ul>
          )}
          {!isLoggedIn && (
            <li>
              <Link to="/auth">Login</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
