import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import EditIcon from "@material-ui/icons/Edit";
import React, { useContext, useEffect, useState } from "react";
import {
  PROJECTS_URL,
  TASKS_URL,
  USERS_URL
} from "../../constants/resourceConstants";
import { DEV_ROLE } from "../../constants/roleConstants";
import { axios } from "../../http/axios";
import AuthContext from "../../store/auth-context";
import { getTaskStatuses, isValidField } from "../../utils";
import DropDown from "../Dialog/DropDown/DropDown";

export default function EditTaskDialog(props) {
  const errorTest = {
    fontSize: 12,
    color: "#d3212d",
    display: "inline-block",
  };

  useEffect(() => {
    if (authCtx.userRole !== DEV_ROLE) {
      fetchProjects();
      fetchUsers();
    }
  }, []);

  const authCtx = useContext(AuthContext);

  const [description, setDescription] = useState("");
  const [progress, setProgress] = useState("");

  // dropdown
  const [status, setStatus] = React.useState("");
  const [projectCodes, setProjectCodes] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [enteredProjectCode, setEnteredProjectCode] = React.useState("");
  const [assignee, setAssignee] = React.useState("");

  const [open, setOpen] = React.useState(false);

  const [isValidDescription, setIsValidDescription] = useState(
    isValidField(description)
  );
  const [isValidProgress, setIsValidProgress] = useState(!isNaN(progress));

  const [isValidStatus, setIsValidStatus] = useState(status.length >= 1);
  const [isValidEnteredProjectCode, setIsValidEnteredProjectCode] = useState(
    isValidField(enteredProjectCode)
  );
  const [isValidAssignee, setIsValidAssignee] = useState(
    isValidField(assignee)
  );

  const handleClickOpen = () => {
    const currentElement = props.rows.filter(
      (element) => element.id === props.elementId
    )[0];
    setDescription(currentElement.description);
    setProgress(currentElement.progress);
    setStatus(currentElement.status);
    setEnteredProjectCode(currentElement.projectCode);
    setAssignee(currentElement.assignee);

    setIsValidDescription(isValidField(currentElement.description));
    setIsValidStatus(currentElement.status.length > 1);
    setIsValidAssignee(true);
    setIsValidEnteredProjectCode(true);
    setIsValidProgress(!isNaN(progress));
    setOpen(true);
  };

  const handleClose = () => {
    resetFields();
    setOpen(false);
  };

  const handleCreate = () => {
    updateTask();
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
    setIsValidProgress(!isNaN(e.target.value));
    console.log(!isNaN(e.target.value));
  };

  const updateTask = () => {
    const promise = axios.put(
      TASKS_URL + "/" + props.elementId,
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
      .then(() => {
        props.fetchElements();
        setOpen(false);
        alert("Task updated successfully");
      })
      .catch((err) => {
        //TODO: snackbar alert message
        alert(err.response.data);
        setOpen(false);
      });
  };

  const fetchProjects = () => {
    const promise = axios.get(PROJECTS_URL, {
      headers: {
        Authorization: authCtx.token,
      },
    });

    promise
      .then((res) => {
        let fetchedProjectCodes = [];
        res.data.map((project) => fetchedProjectCodes.push(project.code));
        setProjectCodes(fetchedProjectCodes);
      })
      .catch((err) => {
        //TODO: snackbar alert message
        alert(err.response.data);
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

  // const showProjectCodeDropdown = props.domain !== PROJECTS_DOMAIN;
  const showProjectCodeDropdown = authCtx.userRole !== DEV_ROLE;

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        <EditIcon />
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        fullWidth
      >
        <DialogTitle id="form-dialog-title">Update Task</DialogTitle>
        <DialogContent>
          <TextField
            defaultValue={description}
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
            defaultValue={progress}
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
          {showProjectCodeDropdown && (
            <DropDown
              role="Code"
              list={projectCodes}
              field={enteredProjectCode}
              setField={setEnteredProjectCode}
              setIsValid={setIsValidEnteredProjectCode}
            />
          )}
          {authCtx.userRole !== DEV_ROLE && (
            <DropDown
              role="Assignee"
              list={users}
              field={assignee}
              setField={setAssignee}
              setIsValid={setIsValidAssignee}
            />
          )}
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
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
