import GenericTable from "../Table/GenericTable";
import { useState, useEffect } from "react";
import { useContext } from "react";
import classes from "./User.module.css";
import { axios } from "../../http/axios";
import AuthContext from "../../store/auth-context";

const columns = [
  { id: "id", label: "User ID", minWidth: 170 },
  { id: "email", label: "Email", minWidth: 100 },
  { id: "firstName", label: "First Name", minWidth: 100 },
  { id: "lastName", label: "Last Name", minWidth: 100 },
  { id: "username", label: "Username", minWidth: 100 },
  { id: "role", label: "role", minWidth: 100 },
  { id: "actions", label: "Actions", minWidth: 100 },
  ,
];

const UserTable = () => {
  const authCtx = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetchUsers();
  }, []);
  const fetchUsers = () => {
    const promise = axios.get("/api/v1/users", {
      headers: {
        Authorization: authCtx.token,
      },
    });

    promise
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        alert(err.message);
      });
  };
  return (
    <section className={classes.profile}>
      <h1>Users</h1>
      <GenericTable columns={columns} rows={users}/>
    </section>
  );
};

export default UserTable;
