import GenericTable from "../Table/GenericTable";
import { useState, useEffect } from "react";
import { useContext } from "react";
import classes from "./Project.module.css";
import { axios } from "../../http/axios";
import AuthContext from "../../store/auth-context";

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
  const fetchProjects = () => {
    const promise = axios.get("/api/v1/projects", {
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
      <GenericTable columns={columns} rows={projects}/>
    </section>
  );
};

export default ProjectTable;
