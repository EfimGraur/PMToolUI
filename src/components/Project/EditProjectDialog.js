import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import EditIcon from "@material-ui/icons/Edit";
import React, { useContext, useEffect, useState } from "react";
import { PROJECTS_URL, USERS_URL } from "../../constants/resourceConstants";
import { ADMIN_ROLE, PM_ROLE } from "../../constants/roleConstants";
import { axios } from "../../http/axios";
import AuthContext from "../../store/auth-context";
import { isValidField } from "../../utils";
import DropDown from "../Dialog/DropDown/DropDown";
import InfoDialog from "../Dialog/InfoDialog";

export default function EditProjectDialog(props) {
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
    isValidField(enteredAssignee)
  );

  const handleClickOpen = () => {
    const currentElement = props.rows.filter(
      (element) => element.id === props.elementId
    )[0];

    setCode(currentElement.code);
    setName(currentElement.name);
    setEnteredAssignee(currentElement.assignee);
    setIsValidCode(currentElement.code.length > 1);
    setIsValidName(isValidField(currentElement.name));
    setIsValidAssignee(true);
    setOpen(true);
  };

  const handleClose = () => {
    resetFields();
    setOpen(false);
  };

  const handleCreate = () => {
    updateProject();
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

  const updateProject = () => {
    const promise = axios.put(
      PROJECTS_URL + "/" + props.elementId,
      {
        id: props.elementId,
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
        alert("Project updated successfully");
      })
      .catch((err) => {
        //TODO: snackbar alert message
        alert(err.response.data);
        setOpen(false);
      });
  };

  const fetchPMs = () => {
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
        <EditIcon />
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        fullWidth
      >
        <DialogTitle id="form-dialog-title">Update Project</DialogTitle>
        {showDialogContent ? (
          <DialogContent>
            <TextField
              defaultValue={code}
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
              defaultValue={name}
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

            {authCtx.userRole === ADMIN_ROLE && (
              <DropDown
                role={PM_ROLE}
                list={PMs}
                field={enteredAssignee}
                setField={setEnteredAssignee}
                setIsValid={setIsValidAssignee}
              />
            )}
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
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
