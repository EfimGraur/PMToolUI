import { Fragment } from "react";
import SimpleCard from "../Card/SimpleCard";
import MainNavigation from "./MainNavigation";
const Layout = (props) => {
  return (
    <Fragment>
      <MainNavigation />
      <SimpleCard>
        <main>{props.children}</main>
      </SimpleCard>
    </Fragment>
  );
};

export default Layout;
