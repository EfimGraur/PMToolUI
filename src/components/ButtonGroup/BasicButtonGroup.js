import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { makeStyles } from "@material-ui/core/styles";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import EditIcon from "@material-ui/icons/Edit";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

export default function BasicButtonGroup() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ButtonGroup
        variant="contained"
        color="primary"
        aria-label="contained primary button group"
      >
        <Button>
          <EditIcon />
        </Button>
        <Button>
          <DeleteForeverIcon />
        </Button>
      </ButtonGroup>
    </div>
  );
}
