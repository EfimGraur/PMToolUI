import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import AddIcon from "@material-ui/icons/Add";
import React, { useContext, useEffect, useState } from "react";
import {
  PROJECTS_URL,
  TASKS_URL,
  USERS_URL
} from "../../constants/resourceConstants";
import { ADMIN_ROLE, PM_ROLE } from "../../constants/roleConstants";
import { axios } from "../../http/axios";
import AuthContext from "../../store/auth-context";
import { getTaskStatuses, isValidField } from "../../utils";
import DropDown from "../Dialog/DropDown/DropDown";

export default function CreateTaskDialog(props) {
  const errorTest = {
    fontSize: 12,
    color: "#d3212d",
    display: "inline-block",
  };

  const authCtx = useContext(AuthContext);

  const [description, setDescription] = useState("");
  const [progress, setProgress] = useState("");

  // dropdown
  const [status, setStatus] = React.useState([]);
  const [projectCodes, setProjectCodes] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [enteredProjectCode, setEnteredProjectCode] = React.useState("");
  const [assignee, setAssignee] = React.useState("");

  const [open, setOpen] = React.useState(false);

  const [isValidDescription, setIsValidDescription] = useState(
    isValidField(description)
  );
  const [isValidProgress, setIsValidProgress] = useState(progress.length > 1);

  const [isValidStatus, setIsValidStatus] = useState(status.length >= 1);
  const [isValidEnteredProjectCode, setIsValidEnteredProjectCode] = useState(
    enteredProjectCode.length >= 1
  );
  const [isValidAssignee, setIsValidAssignee] = useState(assignee.length >= 1);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    resetFields();
    setOpen(false);
  };

  const handleCreate = () => {
    createTask();
    resetFields();
    setOpen(false);
  };

  const resetFields = () => {
    setIsValidDescription(false);
    setIsValidProgress(false);
    setStatus("");
    setAssignee("");
    setEnteredProjectCode("");
  };

  const onChangeDescription = (e) => {
    setDescription(e.target.value);
    setIsValidDescription(isValidField(e.target.value));
  };
  const onChangeProgress = (e) => {
    setProgress(e.target.value);
    setIsValidProgress(e.target.value.length > 1);
  };

  const createTask = () => {
    const promise = axios.post(
      TASKS_URL,
      {
        description: description,
        progress: progress,
        status: status,
        projectCode: enteredProjectCode,
        assignee: assignee,
      },
      {
        headers: {
          Authorization: authCtx.token,
        },
      }
    );

    promise
      .then((res) => {
        props.fetchElements();
        setOpen(false);
        alert("Task created successfully");
      })
      .catch((err) => {
        //TODO: snackbar alert message
        alert(err.message);
        setOpen(false);
      });
  };

  const fetchProjects = () => {
    let fetchURL;
    if (authCtx.userRole === PM_ROLE) {
      fetchURL = USERS_URL + "/" + authCtx.userId + "/projects";
    } else if (authCtx.userRole === ADMIN_ROLE) {
      fetchURL = PROJECTS_URL;
    }

    const promise = axios.get(fetchURL, {
      headers: {
        Authorization: authCtx.token,
      },
    });

    promise
      .then((res) => {
        let fetchedProjectCodes = new Array();

        res.data.map((project) => fetchedProjectCodes.push(project.code));
        setProjectCodes(fetchedProjectCodes);
      })
      .catch((err) => {
        //TODO: snackbar alert message
        alert(err.message);
      });
  };

  const fetchUsers = () => {
    const promise = axios.get(USERS_URL, {
      headers: {
        Authorization: authCtx.token,
      },
    });

    promise
      .then((res) => {
        let fetchedUsers = new Array();
        res.data.map((user) => fetchedUsers.push(user.username));
        setUsers(fetchedUsers);
      })
      .catch((err) => {
        //TODO: snackbar alert message
        alert(err.message);
      });
  };

  useEffect(() => {
    fetchProjects();

    fetchUsers();
  }, []);

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        <AddIcon />
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        fullWidth
      >
        <DialogTitle id="form-dialog-title">Create Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="description"
            label="Description"
            type="text"
            onChange={onChangeDescription}
            fullWidth
          />
          {!isValidDescription && (
            <p style={errorTest}> description must be valid</p>
          )}
          <TextField
            autoFocus
            margin="dense"
            id="progress"
            label="Progress"
            type="text"
            onChange={onChangeProgress}
            fullWidth
          />
          {!isValidProgress && (
            <p style={errorTest}> progress name must be valid</p>
          )}

          <DropDown
            role="Status"
            list={getTaskStatuses()}
            field={status}
            setField={setStatus}
            setIsValid={setIsValidStatus}
          />
          <DropDown
            role="Code"
            list={projectCodes}
            field={enteredProjectCode}
            setField={setEnteredProjectCode}
            setIsValid={setIsValidEnteredProjectCode}
          />
          <DropDown
            role="Assignee"
            list={users}
            field={assignee}
            setField={setAssignee}
            setIsValid={setIsValidAssignee}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            color="primary"
            disabled={!isValidDescription || !isValidProgress || !isValidStatus}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
