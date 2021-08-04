import { Switch, Route, Redirect } from "react-router-dom";
import { useContext } from "react";
import Layout from "./components/Layout/Layout";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import AuthContext from "./store/auth-context";
import UserProjectTable from "./components/Project/UserProjectTable";

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
          <Route path="/projects">
            <UserProjectTable />
          </Route>
        )}
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
