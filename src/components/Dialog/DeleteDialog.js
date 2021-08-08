import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import React, { useContext } from "react";
import {
  PROJECTS_DOMAIN,
  TASKS_DOMAIN,
  USERS_DOMAIN,
} from "../../constants/domainConstants";
import {
  PROJECTS_URL,
  TASKS_URL,
  USERS_URL,
} from "../../constants/resourceConstants";
import { axios } from "../../http/axios";
import AuthContext from "../../store/auth-context";

export default function DeleteDialog(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleYesClick = () => {
    deleteAction();
    setOpen(false);
  };

  const authCtx = useContext(AuthContext);
  let deleteUrl;

  if (props.domain === USERS_DOMAIN) {
    deleteUrl = USERS_URL + "/" + props.elementId;
  }
  if (props.domain === PROJECTS_DOMAIN) {
    deleteUrl = PROJECTS_URL + "/" + props.elementId;
  }
  if (props.domain === TASKS_DOMAIN) {
    deleteUrl = TASKS_URL + "/" + props.elementId;
  }

  const deleteAction = () => {
    const promise = axios.delete(deleteUrl, {
      headers: {
        Authorization: authCtx.token,
      },
    });

    promise
      .then((res) => {
        alert("deleted successful!");
        props.fetchElements();
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        <DeleteForeverIcon />
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"DELETE"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this item?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            No
          </Button>
          <Button onClick={handleYesClick} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
