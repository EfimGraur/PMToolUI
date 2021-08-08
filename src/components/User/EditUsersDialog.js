import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import EditIcon from "@material-ui/icons/Edit";
import React, { useContext, useState } from "react";
import { USERS_URL } from "../../constants/resourceConstants";
import { axios } from "../../http/axios";
import AuthContext from "../../store/auth-context";
import { getRoles, isValidEmailField, isValidField } from "../../utils";
import DropDown from "../Dialog/DropDown/DropDown";

export default function EditUserDialog(props) {
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

  const [enteredRole, setEnteredRole] = React.useState("");
  const [open, setOpen] = React.useState(false);

  // const [currentElement, setCurrentElement] = React.useState({});

  const [isValidEmail, setIsValidEmail] = useState(isValidEmailField(email));
  const [isValidFirstName, setIsValidFirstName] = useState(
    isValidField(firstName)
  );
  const [isValidLastName, setIsValidLastName] = useState(
    isValidField(lastName)
  );
  const [isValidRole, setIsValidRole] = useState(enteredRole.length >= 1);

  const handleClickOpen = () => {
    const currentElement = props.rows.filter(
      (element) => element.id === props.elementId
    )[0];

    setEmail(currentElement.email);
    setFirstName(currentElement.firstName);
    setLastName(currentElement.lastName);
    setUsername(currentElement.username);
    setEnteredRole(currentElement.role);

    setIsValidEmail(isValidEmailField(currentElement.email));
    setIsValidFirstName(isValidField(currentElement.firstName));
    setIsValidLastName(isValidField(currentElement.lastName));
    setIsValidRole(true);

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetFields();
  };

  const handleUpdate = () => {
    updateUser();
    resetFields();
    setOpen(false);
  };

  const resetFields = () => {
    setEnteredRole("");
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
  const onChangeUsername = (e) => {
    setUsername(e.target.value);
  };

  const updateUser = () => {
    const promise = axios.put(
      USERS_URL + "/" + props.elementId,
      {
        id: props.elementId,
        email: email,
        firstName: firstName,
        lastName: lastName,
        username: username,
        role: enteredRole,
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
        alert("User updated successfully");
      })
      .catch((err) => {
        //TODO: snackbar alert message
        alert(err.response.data);
        setOpen(false);
      });
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        <EditIcon />
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Update User</DialogTitle>
        <DialogContent>
          <TextField
            defaultValue={email}
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
            defaultValue={firstName}
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
            defaultValue={lastName}
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
            defaultValue={username}
            autoFocus
            margin="dense"
            id="userName"
            label="Username"
            type="text"
            fullWidth
            onChange={onChangeUsername}
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
            onClick={handleUpdate}
            color="primary"
            disabled={
              !isValidEmail ||
              !isValidFirstName ||
              !isValidLastName ||
              !isValidRole
            }
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
