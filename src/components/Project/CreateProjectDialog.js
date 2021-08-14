import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import AddIcon from "@material-ui/icons/Add";
import React, { useContext, useEffect, useState } from "react";
import {PROJECTS_URL, USERS_URL} from "../../constants/resourceConstants";
import { PM_ROLE } from "../../constants/roleConstants";
import { axios } from "../../http/axios";
import AuthContext from "../../store/auth-context";
import { isValidField } from "../../utils";
import DropDown from "../Dialog/DropDown/DropDown";
import InfoDialog from "../Dialog/InfoDialog";
import {MessageType} from "../Snackbar/CustomSnackbar";

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

  const [enteredAssignee, setEnteredAssignee] = React.useState("");
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
    setOpen(false);
    resetFields(); 
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
    props.setAlertRendered(false);
    const promise = axios.post(
      PROJECTS_URL,
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
        props.setAlertRendered(true);
        props.setAlertMessageType(MessageType.CREATED);
      })
      .catch((err) => {
        if(err.response.status === 409){
          props.setAlertRendered(true);
          props.setAlertMessageType(MessageType.DUPLICATE);
          setOpen(false);
          return
        }
        props.setAlertRendered(true);
        props.setAlertMessageType(MessageType.ERROR);
        setOpen(false);
      });
  };

  const fetchPMs = () => {
    props.setAlertRendered(false);
    const promise = axios.get(USERS_URL + "?role=PM", {
      headers: {
        Authorization: authCtx.token,
      },
    });

    promise
      .then((res) => {
        let fetchedPMs = [];
        res.data.map((user) => fetchedPMs.push(user.username));
        setPMs(fetchedPMs);
      })
      .catch((err) => {
        props.setAlertRendered(true);
        props.setAlertMessageType(MessageType.ERROR);
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
        fullWidth
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
              role={PM_ROLE}
              list={PMs}
              field={enteredAssignee}
              setField={setEnteredAssignee}
              setIsValid={setIsValidAssignee}
            />
          </DialogContent>
        ) : (
          <InfoDialog
            handleClose={handleClose}
            title="Project creation not possible"
            message="No Project Managers are available"
          />
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
