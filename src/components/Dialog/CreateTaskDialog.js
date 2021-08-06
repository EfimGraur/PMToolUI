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
import { isValidEmailField } from "../../utils";
import { getRoles } from "../../utils";

export default function CreateTaskDialog(props) {
  const errorTest = {
    fontSize: 12,
    color: "#d3212d",
    display: "inline-block",
  };

  const authCtx = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [enteredRole, setEnteredRole] = React.useState([]);
  const [open, setOpen] = React.useState(false);

  const [isValidEmail, setIsValidEmail] = useState(isValidEmailField(email));
  const [isValidFirstName, setIsValidFirstName] = useState(
    isValidField(firstName)
  );
  const [isValidLastName, setIsValidLastName] = useState(
    isValidField(lastName)
  );
  const [isValidRole, setIsValidRole] = useState(enteredRole.length >= 1);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    resetFields();
    setOpen(false);
  };

  const handleCreate = () => {
    createUser();
    resetFields();
    setOpen(false);
  };

  const resetFields = () => {
    setEnteredRole("");
    setPassword("");
    setIsValidRole(false);
    setIsValidEmail(false);
    setIsValidFirstName(false);
    setIsValidLastName(false);
  };

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
    setIsValidEmail(isValidEmailField(e.target.value));
  };
  const onChangeFirstName = (e) => {
    setFirstName(e.target.value);
    setIsValidFirstName(isValidField(e.target.value));
  };
  const onChangeLastName = (e) => {
    setLastName(e.target.value);
    setIsValidLastName(isValidField(e.target.value));
  };
  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };
  const onChangeUsername = (e) => {
    setUsername(e.target.value);
  };

  const createUser = () => {
    const promise = axios.post(
      "/api/v1/users",
      {
        email: email,
        firstName: firstName,
        lastName: lastName,
        username: username,
        role: enteredRole,
        password: password,
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
        alert('User created successfully');
      })
      .catch((err) => {
        //TODO: snackbar alert message
        alert(err.message);
        setOpen(false);
      });
  };
//TODO: move to CreateProjectsDialog
  // const fetchProjects = () => {
  //   const promise = axios.get("/api/v1/projects", {
  //     headers: {
  //       Authorization: authCtx.token,
  //     },
  //   });

  //   promise
  //     .then((res) => {
  //       let projects = [];
  //       res.data.map((project) => {
  //         projects.push(project.name);
  //       });
  //       setPMs(projects);
  //     })
  //     .catch((err) => {
  //       alert(err.message);
  //     });
  // };
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
        <DialogTitle id="form-dialog-title">Create</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Email"
            type="text"
            onChange={onChangeEmail}
            fullWidth
          />
          {!isValidEmail && <p style={errorTest}> email must be valid</p>}
          <TextField
            autoFocus
            margin="dense"
            id="firstName"
            label="First Name"
            type="text"
            onChange={onChangeFirstName}
            fullWidth
          />
          {!isValidFirstName && (
            <p style={errorTest}> first name must be valid</p>
          )}
          <TextField
            autoFocus
            margin="dense"
            id="lastName"
            label="Last Name"
            type="text"
            onChange={onChangeLastName}
            fullWidth
          />
          {!isValidLastName && (
            <p style={errorTest}> last name must be valid</p>
          )}
          <TextField
            autoFocus
            margin="dense"
            id="userName"
            label="Username"
            type="text"
            fullWidth
            onChange={onChangeUsername}
          />
          <TextField
            autoFocus
            margin="dense"
            id="password"
            label="Password"
            type="password"
            fullWidth
            onChange={onChangePassword}
          />
          <DropDown
            role="Role"
            list={getRoles()}
            field={enteredRole}
            setField={setEnteredRole}
            setIsValid={setIsValidRole}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            color="primary"
            disabled={
              !isValidEmail ||
              !isValidFirstName ||
              !isValidLastName ||
              !isValidRole
            }
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
