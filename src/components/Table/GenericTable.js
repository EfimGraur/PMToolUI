import { ButtonGroup } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import React, { useContext } from "react";
import {
  PROJECTS_DOMAIN,
  TASKS_DOMAIN,
  USERS_DOMAIN
} from "../../constants/domainConstants";
import { ADMIN_ROLE, DEV_ROLE } from "../../constants/roleConstants";
import AuthContext from "../../store/auth-context";
import CreateTaskDialog from "../Task/CreateTaskDialog";
import CreateUserDialog from "../User/CreateUsersDialog";
import CreateProjectDialog from "../Project/CreateProjectDialog";
import DeleteDialog from "../Dialog/DeleteDialog";
import EditUserDialog from "../User/EditUsersDialog";
import EditProjectDialog from "../Project/EditProjectDialog";
import EditTaskDialog from "../Task/EditTaskDialog";



const useStyles = makeStyles({
  root: {
    width: "100%",
  },
  container: {
    maxHeight: 440,
  },
  container: {
    position: "relative",
    alignItems: "left",
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
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const showUserDialogs = props.domain === USERS_DOMAIN;

  const showProjectsDialog =
    props.domain === PROJECTS_DOMAIN && authCtx.userRole === ADMIN_ROLE;

  const showCreateTaskDialog =
    props.domain === TASKS_DOMAIN && authCtx.userRole !== DEV_ROLE;

  const showDeleteDialog =
    props.domain !== TASKS_DOMAIN || authCtx.userRole !== DEV_ROLE;

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell align="right" colSpan="10">
                {/* <Button className={classes.button}><AddIcon/></Button> */}
                {showUserDialogs && (
                  <CreateUserDialog fetchElements={props.fetchElements} />
                )}
                {showProjectsDialog && (
                  <CreateProjectDialog fetchElements={props.fetchElements} />
                )}
                {showCreateTaskDialog && (
                  <CreateTaskDialog
                    fetchElements={props.fetchElements}
                    rows={props.rows}
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
                            {/* <BasicButtonGroup className={classes.buttonGroup}/> */}
                            <ButtonGroup>
                              {showDeleteDialog && (
                                <DeleteDialog
                                  domain={props.domain}
                                  elementId={row.id}
                                  fetchElements={props.fetchElements}
                                />
                              )}
                              {props.domain === USERS_DOMAIN && (
                                <EditUserDialog
                                  domain={props.domain}
                                  elementId={row.id}
                                  fetchElements={props.fetchElements}
                                  rows={props.rows}
                                />
                              )}
                              {props.domain === PROJECTS_DOMAIN && (
                                <EditProjectDialog
                                  domain={props.domain}
                                  elementId={row.id}
                                  fetchElements={props.fetchElements}
                                  rows={props.rows}
                                />
                              )}
                              {props.domain === TASKS_DOMAIN && (
                                <EditTaskDialog
                                  domain={props.domain}
                                  elementId={row.id}
                                  fetchElements={props.fetchElements}
                                  rows={props.rows}
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
      {/* <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={props.rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      /> */}
    </Paper>
  );
}
