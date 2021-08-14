import { ButtonGroup } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import React, {useContext, useState} from "react";
import {
  PROJECTS_DOMAIN,
  TASKS_DOMAIN,
  USERS_DOMAIN
} from "../../constants/domainConstants";
import { ADMIN_ROLE, DEV_ROLE } from "../../constants/roleConstants";
import AuthContext from "../../store/auth-context";
import DeleteDialog from "../Dialog/DeleteDialog";
import CreateProjectDialog from "../Project/CreateProjectDialog";
import EditProjectDialog from "../Project/EditProjectDialog";
import CustomizedSnackbar from "../Snackbar/CustomSnackbar";
import CreateTaskDialog from "../Task/CreateTaskDialog";
import EditTaskDialog from "../Task/EditTaskDialog";
import CreateUserDialog from "../User/CreateUsersDialog";
import EditUserDialog from "../User/EditUsersDialog";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    position: "relative",
    alignItems: "left",
    maxHeight: 440,
  },
  button: {
    textSizeAdjust: "50",
    backgroundColor: "#3f51b5",
    margin: "left",
  },
});

export default function GenericTable(props) {
  const authCtx = useContext(AuthContext);
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  //TODO: implement pagination
  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage);
  // };
  //
  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(+event.target.value);
  //   setPage(0);
  // };
  const [alertRendered, setAlertRendered] = useState(false);
  const [alertMessageType, setAlertMessageType] = useState("")

  const showUserDialogs = props.domain === USERS_DOMAIN;

  const showProjectsDialog =
    props.domain === PROJECTS_DOMAIN && authCtx.userRole === ADMIN_ROLE;

  const showCreateTaskDialog =
    props.domain === TASKS_DOMAIN && authCtx.userRole !== DEV_ROLE;

  const showDeleteDialog =
    props.domain !== TASKS_DOMAIN || authCtx.userRole !== DEV_ROLE;

  return (
    <Paper className={classes.root}>
      <CustomizedSnackbar
          messageType={alertMessageType}
          render={alertRendered}
          domain={props.domain}
        />
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell align="right" colSpan="10">
                {showUserDialogs && (
                  <CreateUserDialog fetchElements={props.fetchElements} setAlertRendered={setAlertRendered} setAlertMessageType={setAlertMessageType}/>
                )}
                {showProjectsDialog && (
                  <CreateProjectDialog fetchElements={props.fetchElements} setAlertRendered={setAlertRendered} setAlertMessageType={setAlertMessageType} />
                )}
                {showCreateTaskDialog && (
                  <CreateTaskDialog
                    fetchElements={props.fetchElements}
                    rows={props.rows}
                    setAlertRendered={setAlertRendered}
                    setAlertMessageType={setAlertMessageType}
                  />
                )}
              </TableCell>
            </TableRow>

            <TableRow>
              {props.columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {props.rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    {props.columns.map((column, index) => {
                      const value = row[column.id];
                      if (index === props.columns.length - 2) {
                        return (
                          <TableCell key={column.id} align={column.align}>
                            <ButtonGroup>
                              {showDeleteDialog && (
                                <DeleteDialog
                                  domain={props.domain}
                                  elementId={row.id}
                                  fetchElements={props.fetchElements}
                                  setAlertRendered={setAlertRendered}
                                  setAlertMessageType={setAlertMessageType}
                                />
                              )}
                              {props.domain === USERS_DOMAIN && (
                                <EditUserDialog
                                  domain={props.domain}
                                  elementId={row.id}
                                  fetchElements={props.fetchElements}
                                  rows={props.rows}
                                  setAlertRendered={setAlertRendered}
                                  setAlertMessageType={setAlertMessageType}
                                />
                              )}
                              {props.domain === PROJECTS_DOMAIN && (
                                <EditProjectDialog
                                  domain={props.domain}
                                  elementId={row.id}
                                  fetchElements={props.fetchElements}
                                  rows={props.rows}
                                  setAlertRendered={setAlertRendered}
                                  setAlertMessageType={setAlertMessageType}
                                />
                              )}
                              {props.domain === TASKS_DOMAIN && (
                                <EditTaskDialog
                                  domain={props.domain}
                                  elementId={row.id}
                                  fetchElements={props.fetchElements}
                                  rows={props.rows}
                                  setAlertRendered={setAlertRendered}
                                  setAlertMessageType={setAlertMessageType}
                                />
                              )}
                            </ButtonGroup>
                          </TableCell>
                        );
                      } else {
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === "number"
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      }
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
