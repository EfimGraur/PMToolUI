import { useContext, useEffect, useState } from "react";
import { USERS_DOMAIN } from "../../constants/domainConstants";
import { USERS_URL } from "../../constants/resourceConstants";
import { axios } from "../../http/axios";
import AuthContext from "../../store/auth-context";
import GenericTable from "../Table/GenericTable";
import classes from "./User.module.css";

const columns = [
  { id: "id", label: "User ID", minWidth: 170 },
  { id: "email", label: "Email", minWidth: 100 },
  { id: "firstName", label: "First Name", minWidth: 100 },
  { id: "lastName", label: "Last Name", minWidth: 100 },
  { id: "username", label: "Username", minWidth: 100 },
  { id: "role", label: "role", minWidth: 100 },
  { id: "actions", label: "Actions", minWidth: 100, align: "center" },
  ,
];

const UserTable = () => {
  const authCtx = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetchUsers();
  }, []);
  const fetchUsers = () => {
    const promise = axios.get(USERS_URL, {
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
      <GenericTable
        columns={columns}
        rows={users}
        domain={USERS_DOMAIN}
        fetchElements={fetchUsers}
      />
    </section>
  );
};

export default UserTable;
