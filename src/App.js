import { Switch, Route, Redirect } from "react-router-dom";
import { useContext } from "react";
import Layout from "./components/Layout/Layout";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import AuthContext from "./store/auth-context";
import ProjectTable from "./components/Project/ProjectTable";
import UserTable from "./components/User/UserTable";

function App() {
  const authCtx = useContext(AuthContext);
  return (
    <Layout>
      <Switch>
        {!authCtx.isLoggedIn && (
          <Switch>
            <Route path="/auth">
              <AuthPage />
            </Route>
            <Route path="/" exact>
              <HomePage />
            </Route>
          </Switch>
        )}
        {authCtx.isLoggedIn && (
          <Switch>
            <Route path="/projects">
              <ProjectTable />
            </Route>
            <Route path="/users">
              <UserTable />
            </Route>
          </Switch>
        )}
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
