import { useContext } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import ProjectTable from "./components/Project/ProjectTable";
import TaskTable from "./components/Task/TaskTable";
import UserTable from "./components/User/UserTable";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import AuthContext from "./store/auth-context";

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
            <Route path="/tasks">
              <TaskTable />
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
