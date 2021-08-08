import { useContext, useEffect, useState } from "react";
import { PROJECTS_DOMAIN } from "../../constants/domainConstants";
import { USERS_URL } from "../../constants/resourceConstants";
import { ADMIN_ROLE, PM_ROLE } from "../../constants/roleConstants";
import { axios } from "../../http/axios";
import AuthContext from "../../store/auth-context";
import GenericTable from "../Table/GenericTable";
import classes from "./Project.module.css";

const columns = [
  { id: "id", label: "Project ID", minWidth: 170 },
  { id: "code", label: "Code", minWidth: 100 },
  { id: "name", label: "Name", minWidth: 100 },
  { id: "assignee", label: "Asignee", minWidth: 100 },
  { id: "actions", label: "Actions", minWidth: 100 },
  ,
];

const ProjectTable = () => {
  const authCtx = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    fetchProjects();
  }, []);

  const userId = authCtx.userId;
  let projectsURL;
  if (authCtx.userRole === ADMIN_ROLE) {
    projectsURL = "/api/v1/projects";
  } else if (authCtx.userRole === PM_ROLE) {
    projectsURL = USERS_URL + "/" + userId + "/projects";
  }

  const fetchProjects = () => {
    const promise = axios.get(projectsURL, {
      headers: {
        Authorization: authCtx.token,
      },
    });

    promise
      .then((res) => {
        setProjects(res.data);
      })
      .catch((err) => {
        alert(err.message);
      });
  };
  return (
    <section className={classes.profile}>
      <h1>Projects</h1>
      <GenericTable
        columns={columns}
        rows={projects}
        domain={PROJECTS_DOMAIN}
        fetchElements={fetchProjects}
      />
    </section>
  );
};

export default ProjectTable;
