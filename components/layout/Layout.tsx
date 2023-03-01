import React, { Fragment } from "react";
import MainHeader from "./mainNavigation";
import { PropsWithChildren } from "react";
import classes from './Layout.module.css';
const Layout: React.FC<PropsWithChildren> = (props) => {
  return (
    <Fragment>
      <MainHeader />
      <main className={classes.main}>{props.children}</main>
    </Fragment>
  );
};

export default Layout;
