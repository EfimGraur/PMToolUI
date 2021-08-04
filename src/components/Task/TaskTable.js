import GenericTable from "../Table/GenericTable";
import { useState, useEffect } from "react";
import { useContext } from "react";
import classes from "./Task.module.css";
import { axios } from "../../http/axios";
import AuthContext from "../../store/auth-context";

const columns = [
  { id: "id", label: "User ID", minWidth: 170 },
  { id: "description", label: "Description", minWidth: 100 },
  { id: "pm", label: "Project Manager", minWidth: 100 },
  { id: "progress", label: "Progress", minWidth: 100 },
  { id: "status", label: "Status", minWidth: 100 },
  { id: "deadline", label: "Deadline", minWidth: 100 },
  { id: "project", label: "Project", minWidth: 100 },
  { id: "assignee", label: "Assignee", minWidth: 100 },
  { id: "actions", label: "Actions", minWidth: 100 },
  ,
];

const TaskTable = () => {
  const authCtx = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    fetchTasks();
  }, []);

  const userId = authCtx.userId;
  let tasksURL; 
  if(authCtx.userRole === "ADMIN"){
    tasksURL = "/api/v1/tasks";
    console.log('**3333*');
  } else if(authCtx.userRole === "PM"){
    tasksURL = "/api/v1/users/" + userId + "/projects/tasks";
    console.log('**444*');
  } else if(authCtx.userRole === "DEV"){
    tasksURL = "/api/v1/users/" + userId + "/tasks";
    console.log('**555*');
  }
  const fetchTasks = () => {
    const promise = axios.get(tasksURL, {
      headers: {
        Authorization: authCtx.token,
      },
    });

    promise
      .then((res) => {
        setTasks(res.data);
        console.log('***',res.data);
      })
      .catch((err) => {
        alert(err.message);
      });
  };
  return (
    <section className={classes.profile}>
      <h1>Tasks</h1>
      <GenericTable columns={columns} rows={tasks}/>
    </section>
  );
};

export default TaskTable;
