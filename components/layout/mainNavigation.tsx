import classes from "./mainNavigation.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import { AuthContext } from "../../context/auth-context";
import { AuthContextType } from "@/context/auth";
import React from "react";

const MainNavigation: React.FC = (props) => {
  const router = useRouter();
  const context = React.useContext(AuthContext) as AuthContextType;

  return (
    <header className={classes.main_navigation}>
      <div className={classes.main_navigation__logo}>
        <h1 style={{ color: "white" }}>EasyEvent</h1>
      </div>
      <nav className={classes.main_navigation__items}>
        <ul>
          {!context.data.token && (
            <li>
              <Link
                href="/auth"
                className={router.pathname == "/auth" ? classes.active : ""}
              >
                Authentication
              </Link>
            </li>
          )}
          <li>
            <Link
              href="/events"
              className={router.pathname == "/events" ? classes.active : ""}
            >
              Events
            </Link>
          </li>
          {context.data.token && (
            <React.Fragment>
              <li>
                <Link
                  href="/bookings"
                  className={
                    router.pathname == "/bookings" ? classes.active : ""
                  }
                >
                  Bookings
                </Link>
              </li>
              <li>
                <button onClick={context.logout}>Logout</button>
              </li>
            </React.Fragment>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
