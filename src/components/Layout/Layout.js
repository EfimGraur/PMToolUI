import { Fragment } from 'react';
import SimpleCard from '../Card/SimpleCard';
import MainNavigation from './MainNavigation';
import { Paper } from '@material-ui/core';
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

