import React, { useEffect, useContext, useRef, useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import AddIcon from "@material-ui/icons/Add";
import DropDown from "./DropDown/DropDown";
import AuthContext from "../../store/auth-context";
import { axios } from "../../http/axios";
import { isValidField } from "../../utils";
import DialogContentText from "@material-ui/core/DialogContentText";
import InfoDialog from "./InfoDialog";

export default function CreateProjectDialog(props) {
  const errorTest = {
    fontSize: 12,
    color: "#d3212d",
    display: "inline-block",
  };

  const authCtx = useContext(AuthContext);

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [PMs, setPMs] = useState([]);

  const [enteredAssignee, setEnteredAssignee] = React.useState([]);
  const [open, setOpen] = React.useState(false);

  const [isValidCode, setIsValidCode] = useState(code.length > 2);
  const [isValidName, setIsValidName] = useState(isValidField(name));

  const [isValidAssignee, setIsValidAssignee] = useState(
    enteredAssignee.length >= 1
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    resetFields();
    setOpen(false);
  };

  const handleCreate = () => {
    createProject();
    resetFields();
    setOpen(false);
  };

  const resetFields = () => {
    setEnteredAssignee("");
    setCode("");
    setIsValidCode(false);
    setIsValidName(false);
  };

  const onChangeCode = (e) => {
    setCode(e.target.value);
    setIsValidCode(e.target.value.length > 2);
  };
  const onChangeName = (e) => {
    setName(e.target.value);
    setIsValidName(isValidField(e.target.value));
  };

  const createProject = () => {
    const promise = axios.post(
      "/api/v1/projects",
      {
        code: code,
        name: name,
        assignee: enteredAssignee,
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
        alert("Project created successfully");
      })
      .catch((err) => {
        //TODO: snackbar alert message
        alert(err.message);
        setOpen(false);
      });
  };

  const fetchPMs = () => {
    const promise = axios.get("/api/v1/users?role=PM", {
      headers: {
        Authorization: authCtx.token,
      },
    });

    promise
      .then((res) => {
        let fetchedPMs = new Array();
        res.data.map((user) => fetchedPMs.push(user.username));
        setPMs(fetchedPMs);
      })
      .catch((err) => {
        //TODO: snackbar alert message
        alert(err.message);
      });
  };

  useEffect(() => {
    fetchPMs();
  }, []);

  const showDialogContent = PMs.length > 1;

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        <AddIcon />
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Create Project</DialogTitle>
        {showDialogContent ? (
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="code"
              label="Project Code"
              type="text"
              onChange={onChangeCode}
              fullWidth
            />
            {!isValidCode && (
              <p style={errorTest}> project code must be valid</p>
            )}
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Project Name"
              type="text"
              onChange={onChangeName}
              fullWidth
            />
            {!isValidName && (
              <p style={errorTest}> project name must be valid</p>
            )}

            <DropDown
              role="PM"
              list={PMs}
              field={enteredAssignee}
              setField={setEnteredAssignee}
              setIsValid={setIsValidAssignee}
            />
          </DialogContent>
        ) : (
          <InfoDialog handleClose={handleClose} title="Project creation not possible" message="No Project Managers are available"/>
        )}
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            color="primary"
            disabled={!isValidCode || !isValidName || !isValidAssignee}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
