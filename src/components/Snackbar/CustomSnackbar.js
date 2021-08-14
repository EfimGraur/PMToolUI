import React,{useState,useEffect} from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

  export const MessageType = {
	CREATED: "created",
	DELETED: "deleted",
    UPDATED: "updated",
	DUPLICATE: "duplicate",
	ERROR: "error",
    NOT_FOUND: "not_found",
    UNAUTHORIZED: "unauthorized",
    NOT_EXIST: "not_exist",
}

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function CustomizedSnackbar(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(props.render);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(true);
  useEffect(() => {
    setOpen(props.render);
  }, [props.render]);

  useEffect(() => {
    switch (props.messageType) {
      case MessageType.DELETED:
        setMessage(`${props.domain} deleted successfully!`);
        setIsError(false);
        break;
      case MessageType.UPDATED:
        setMessage(`${props.domain} updated successfully!`);
        setIsError(false);
        break;
      case MessageType.CREATED:
        setMessage(`${props.domain} created successfully!`);
        setIsError(false);
        break;
      case MessageType.DUPLICATE:
        setMessage("Entry already exists!");
        setIsError(true);
        break;
      case MessageType.NOT_FOUND:
        setMessage(`${props.domain} not found`);
        setIsError(true);
        break;
      case MessageType.UNAUTHORIZED:
        setMessage("You are not authorized to perform this action!");
        setIsError(true);
        break;
      case MessageType.NOT_EXIST:
        setMessage(`The ${props.domain} does not exist`);
        setIsError(true);
        break;
      case MessageType.ERROR:
        setMessage("Something went wrong!");
        setIsError(true);
        break;
    }
  }, [props.messageType, props.domain]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={isError ? "error" : "success"}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
