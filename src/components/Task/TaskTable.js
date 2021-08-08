import { useContext, useEffect, useState } from "react";
import { TASKS_DOMAIN } from "../../constants/domainConstants";
import { TASKS_URL, USERS_URL } from "../../constants/resourceConstants";
import { ADMIN_ROLE, DEV_ROLE, PM_ROLE } from "../../constants/roleConstants";
import { axios } from "../../http/axios";
import AuthContext from "../../store/auth-context";
import GenericTable from "../Table/GenericTable";
import classes from "./Task.module.css";

const columns = [
  { id: "id", label: "User ID", minWidth: 170 },
  { id: "description", label: "Description", minWidth: 100 },
  { id: "pm", label: "Project Manager", minWidth: 100 },
  { id: "progress", label: "Progress", minWidth: 100 },
  { id: "status", label: "Status", minWidth: 100 },
  { id: "deadline", label: "Deadline", minWidth: 100 },
  { id: "projectCode", label: "Project Code", minWidth: 100 },
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
  if (authCtx.userRole === ADMIN_ROLE) {
    tasksURL = TASKS_URL;
  } else if (authCtx.userRole === PM_ROLE) {
    tasksURL = USERS_URL + "/" + userId + "/projects/tasks";
  } else if (authCtx.userRole === DEV_ROLE) {
    tasksURL = USERS_URL + "/" + userId + "/tasks";
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
      })
      .catch((err) => {
        alert(err.message);
      });
  };
  return (
    <section className={classes.profile}>
      <h1>Tasks</h1>
      <GenericTable
        columns={columns}
        rows={tasks}
        domain={TASKS_DOMAIN}
        fetchElements={fetchTasks}
      />
    </section>
  );
};

export default TaskTable;
