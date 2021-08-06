import React, { useState, useEffect, useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import BasicButtonGroup from "../ButtonGroup/BasicButtonGroup";
import { Button, TableFooter } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import DeleteDialog from "../Dialog/DeleteDialog";
import CreateUserDialog from "../Dialog/CreateUsersDialog";
import CreateProjectDialog from "../Dialog/CreateProjectDialog";
import AuthContext from "../../store/auth-context";
import CreateTaskDialog from "../Dialog/CreateTaskDialog";

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
  const showCreateUserDialog = props.domain === "users";
  const showCreateProjectDialog = props.domain === "projects" && authCtx.userRole ==='ADMIN';
  const showCreateTaskDialog = props.domain === "tasks" && authCtx.userRole !=='DEV';

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell align="right" colSpan="10">
                {/* <Button className={classes.button}><AddIcon/></Button> */}
                {showCreateUserDialog && <CreateUserDialog fetchElements={props.fetchElements}/>}
                {showCreateProjectDialog  && <CreateProjectDialog fetchElements={props.fetchElements}/>}
                {showCreateTaskDialog  && <CreateTaskDialog fetchElements={props.fetchElements}/>}
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
                            <DeleteDialog
                              domain={props.domain}
                              elementId={row.id}
                              fetchElements={props.fetchElements}
                            />
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
